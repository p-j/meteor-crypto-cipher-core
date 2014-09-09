var C = CryptoJS;
// Closure for the data object we are creating
(function() {
    var data = {};
    data.ciphertext = C.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
    data.key = C.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
    data.iv = C.enc.Hex.parse('202122232425262728292a2b2c2d2e2f');
    data.salt = C.enc.Hex.parse('0123456789abcdef');
    data.algorithm = C.algo.AES;
    data.mode = C.mode.CBC;
    data.padding = C.pad.PKCS7;
    data.blockSize = data.algorithm.blockSize;
    data.formatter = C.format.OpenSSL;

    data.cipherParams = C.lib.CipherParams.create({
        ciphertext: data.ciphertext,
        key: data.key,
        iv: data.iv,
        salt: data.salt,
        algorithm: data.algorithm,
        mode: data.mode,
        padding: data.padding,
        blockSize: data.blockSize,
        formatter: data.formatter
    });

    Tinytest.add('MeteorCryptoCipherCore - Init', function (t) {
        t.equal(data.ciphertext, data.cipherParams.ciphertext);
        t.equal(data.key, data.cipherParams.key);
        t.equal(data.iv, data.cipherParams.iv);
        t.equal(data.salt, data.cipherParams.salt);
        t.equal(data.algorithm, data.cipherParams.algorithm);
        t.equal(data.mode, data.cipherParams.mode);
        t.equal(data.padding, data.cipherParams.padding);
        t.equal(data.blockSize, data.cipherParams.blockSize);
        t.equal(data.formatter, data.cipherParams.formatter);
    });

    Tinytest.add('MeteorCryptoCipherCore - ToString 0', function (t) {
        t.equal(C.format.OpenSSL.stringify(data.cipherParams), data.cipherParams.toString());
    });

    Tinytest.add('MeteorCryptoCipherCore - ToString 1', function (t) {
        var JsonFormatter = {
            stringify: function (cipherParams) {
                return '{ ct: ' + cipherParams.ciphertext + ', iv: ' + cipherParams.iv + ' }';
            }
        };

        t.equal(JsonFormatter.stringify(data.cipherParams), data.cipherParams.toString(JsonFormatter));
    });
}());


Tinytest.add('MeteorCryptoCipherCore - Password Based Cipher Encrypt', function (t) {
    // Compute actual
    var actual = C.lib.PasswordBasedCipher.encrypt(C.algo.AES, 'Hello, World!', 'password');

    // Compute expected
    var aes = C.algo.AES.createEncryptor(actual.key, { iv: actual.iv });
    var expected = aes.finalize('Hello, World!');

    t.equal(actual.ciphertext.toString(), expected.toString());
});

Tinytest.add('MeteorCryptoCipherCore - Password Based Cipher Decrypt', function (t) {
    var ciphertext = C.lib.PasswordBasedCipher.encrypt(C.algo.AES, 'Hello, World!', 'password');
    var plaintext = C.lib.PasswordBasedCipher.decrypt(C.algo.AES, ciphertext, 'password');

    t.equal(plaintext.toString(C.enc.Utf8), 'Hello, World!');
});

// Closure for the data object we are creating
(function() {
    var data = {};
    data.message = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);
    data.key = C.lib.WordArray.create([0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f]);
    data.iv = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);

    Tinytest.add('MeteorCryptoCipherCore - Serializable Cipher Encrypt', function (t) {
        // Compute expected
        var aes = C.algo.AES.createEncryptor(data.key, { iv: data.iv });
        var ciphertext = aes.finalize(data.message);
        var expected = C.lib.CipherParams.create({
            ciphertext: ciphertext,
            key: data.key,
            iv: data.iv,
            algorithm: C.algo.AES,
            mode: aes.cfg.mode,
            padding: aes.cfg.padding,
            blockSize: aes.blockSize,
            formatter: C.format.OpenSSL
        });

        // Compute actual
        var actual = C.lib.SerializableCipher.encrypt(C.algo.AES, data.message, data.key, { iv: data.iv });

        // Test
        t.equal(actual.toString(), expected.toString());
        t.equal(actual.ciphertext.toString(), expected.ciphertext.toString());
        t.equal(actual.key.toString(), expected.key.toString());
        t.equal(actual.iv.toString(), expected.iv.toString());
        t.equal(actual.algorithm, expected.algorithm);
        t.equal(actual.mode, expected.mode);
        t.equal(actual.padding, expected.padding);
        t.equal(actual.blockSize, expected.blockSize);
    });

    Tinytest.add('MeteorCryptoCipherCore - Serializable Cipher Decrypt', function (t) {
        var encrypted = C.lib.SerializableCipher.encrypt(C.algo.AES, data.message, data.key, { iv: data.iv }) + '';
        var decrypted = C.lib.SerializableCipher.decrypt(C.algo.AES, encrypted, data.key, { iv: data.iv });

        t.equal(decrypted.toString(), data.message.toString());
    });

}());


(function() {
    // name: 'OpenSSLFormatter',
    var data = {};

    data.ciphertext = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);
    data.salt = C.lib.WordArray.create([0x01234567, 0x89abcdef]);


    Tinytest.add('MeteorCryptoCipherCore - OpenSSL Formatter Salted To String', function (t) {
        t.equal(
            C.format.OpenSSL.stringify(C.lib.CipherParams.create({ ciphertext: data.ciphertext, salt: data.salt })),
            C.enc.Latin1.parse('Salted__').concat(data.salt).concat(data.ciphertext).toString(C.enc.Base64)
        );
    });

    Tinytest.add('MeteorCryptoCipherCore - OpenSSL Formatter Unsalted To String', function (t) {
        t.equal(
            C.format.OpenSSL.stringify(C.lib.CipherParams.create({ ciphertext: data.ciphertext })),
            data.ciphertext.toString(C.enc.Base64)
        );
    });

    Tinytest.add('MeteorCryptoCipherCore - OpenSSL Formatter Salted From String', function (t) {
        var openSSLStr = C.format.OpenSSL.stringify(C.lib.CipherParams.create({ ciphertext: data.ciphertext, salt: data.salt }));
        var cipherParams = C.format.OpenSSL.parse(openSSLStr);

        t.equal(
            cipherParams.ciphertext.toString(),
            data.ciphertext.toString()
        );
        t.equal(
            cipherParams.salt.toString(),
            data.salt.toString()
        );
    });

    Tinytest.add('MeteorCryptoCipherCore - OpenSSL Formatter Unsalted From String', function (t) {
        var openSSLStr = C.format.OpenSSL.stringify(C.lib.CipherParams.create({ ciphertext: data.ciphertext }));
        var cipherParams = C.format.OpenSSL.parse(openSSLStr);

        t.equal(
            cipherParams.ciphertext.toString(),
            data.ciphertext.toString()
        );
    });
}());
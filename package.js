Package.describe({
  summary: 'Cipher Core Package for CryptoJS, standard secure algorithms',
  version: '0.1.1',
  git: 'https://github.com/p-j/meteor-crypto-cipher-core.git'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@0.9.1.1');

  api.use([
    'jparker:crypto-core@0.1.0',
    'jparker:crypto-base64@0.1.0',
    'jparker:crypto-evpkdf@0.1.0'
  ], ['client', 'server']);

  api.imply([
    'jparker:crypto-core',
    'jparker:crypto-base64',
    'jparker:crypto-evpkdf'
  ], ['client', 'server']);

  api.addFiles('lib/cipher-core.js', ['client', 'server']);
});

Package.onTest(function (api) {
  api.use([
    'jparker:crypto-core@0.1.0',
    'jparker:crypto-cipher-core@0.1.0',
    'jparker:crypto-base64@0.1.0',
    'jparker:crypto-aes@0.1.0',
    'tinytest'
  ], ['client', 'server']);

  api.addFiles('tests/tests.js', ['client', 'server']);
});
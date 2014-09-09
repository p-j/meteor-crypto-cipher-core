Package.describe({
  summary: 'Cipher Core Package for CryptoJS, standard secure algorithms',
  version: '3.1.2',
  git: 'https://github.com/p-j/meteor-crypto-cipher-core.git'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.1.1');
  api.use([
    'jparker:crypto-core@3.1.2',
  	'jparker:crypto-base64@3.1.2',
  	'jparker:crypto-evpkdf@3.1.2'
	], ['client', 'server']);

	api.imply([
    'jparker:crypto-core',
    'jparker:crypto-base64',
  	'jparker:crypto-evpkdf'
  ], ['client', 'server']);

  api.addFiles(['lib/cipher-core.js']);
});

Package.onTest(function (api) {
	api.use([
		'jparker:crypto-core@3.1.2',
		'jparker:crypto-cipher-core@3.1.2',
		'jparker:crypto-base64@3.1.2',
		'tinytest'
	], ['client', 'server']);

	api.addFiles('tests/tests.js', ['client', 'server']);
});

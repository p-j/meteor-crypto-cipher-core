Package.describe({
  summary: 'Cipher Core Package for CryptoJS, standard secure algorithms',
  version: '3.1.2',
  git: 'https://github.com/p-j/meteor-crypto-cipher-core.git'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.1.1');
  api.use('jparker:crypto-core@3.1.2', ['client', 'server']);
	api.imply('jparker:crypto-core', ['client', 'server']);
  api.addFiles(['lib/cipher-core.js', 'lib/evpkdf.js']);
});

// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('jparker:crypto-cipher-core');
//   api.addFiles('jparker:crypto-cipher-core-tests.js');
// });

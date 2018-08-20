Faucet site
============

This site gives CCC to a user from a specific CodeChain account. This site request the user to authenticate using twitter.

Install
--------

Run `yarn install`
Run `yarn pm2 install typescript`
Run `yarn pm2 install pm2-logrotate`

Config
------

You should set below fields in config/local.json

```json
{
    "codechainURL": "http://127.0.0.1:8080",
    "twitterConsumerKey": "",
    "twitterConsumerSecret": "",
    "maketingText": "I love CodeChain",
    "recaptchaSiteKey": "",
    "recaptchaSecret": "",
    "blockExplorerURL": "http://127.0.0.1:3000",
    "faucetCodeChainAddress": "",
    "faucetCodeChainPasspharase": ""
}
```

### Config your CodeChain account

To run this site, you need CodeChain platform address with sufficient CCC. Set `faucetCodeChainAddress` to your CodeChain platform address, and then set `faucetCodeChainPasspharase` to the passphrase you used when creating the `faucetCodeChainAddress`.

Run
----

Run `yarn pm2 start ecosystem.config.js`

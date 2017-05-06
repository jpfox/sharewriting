# ShareWriting

## Principle

Web application to permit authors to publish articles under pseudonym without revealing their identity.

Author is identified by its name (pseudo), and long pass phrase.
Pass phrase is never transmitted to server, it is used to generated a cryptographic key pair.
Each author name/pass phrase couple always generate the same key pair.
So ShareWriting can be used on several instances with the same credentials.

Author can check if pass phrase is correct by verfying displayed public key and corresponding Jdenticon (much easier).

Article redaction is stored in a single string (json) and signed with the private key.
Signature is attached with article and can be used to check if article is really comming from this author.

Articles can be moderated and used to produce a public feed in different format : web pages, rss feeds, mailing...

## Installation

    # grab code
    git clone https://github.com/jpfox/sharewriting.git
    
    # enter directory
    cd sharewriting
    
    # install dependencies
    npm install
    
    # to change default port, folder application, proposed languages...
    cp config.json.sample config.json
    nano config.json
    
    # Run
    npm start


## Security

Security is the leitmotiv of this application. Web application run on 4984 TCP port by default.
To secure access for author and help them to keep their identity masked, you should propose it through [Tor hidden service](https://www.torproject.org/docs/hidden-services.html.en) by adding in torrc file :

Linux server :

    HiddenServiceDir /var/lib/tor/hidden_service/sharewriting/
    HiddenServicePort 80 127.0.0.1:4984

OS X server :

    HiddenServiceDir /Library/Tor/var/lib/tor/hidden_service/sharewriting/
    HiddenServicePort 80 127.0.0.1:4984

Windows server (no recommanded in prodution) :

    HiddenServiceDir C:\Users\username\Documents\tor\hidden_service\sharewriting\
    HiddenServicePort 80 127.0.0.1:4984

Restart tor service and you get your onion address in .../tor/hidden_service/sharewriting/hostname file

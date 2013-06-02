webos-otp
=========

Simple WebOS application implementing both RFC 4226 (counter based) and 6238 (time based) for generating one time password. Compatible with Google Authenticator.

Generate `ipk` package and install the app on Palm devices
----------------------------------------------------------

In the `webos-otp` directory, generate the `ipk` package with:
```
palm-package .
```

Then, to install the app on your connected device, do:
```
palm-install re.nemunai.otp_1.0.1_all.ipk
```

Now, on your phone, search an application named "One Time Password", or do on your computer:
```
palm-launch re.nemunai.otp
```

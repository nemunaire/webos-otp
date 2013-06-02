function Account(type, label, key)
{
    //Type 1, 4 and 5: HOTP; 2 and 3: TOTP
    this.type = type;

    this.label = label;
    this.key = key;

    this.digits = 6;
    this.counter = 0;
    this.period = 30;

    this.current = "test";
}

Account.prototype.checkKey = function()
{
    var nkey;

    if (this.type == 3 || this.type == 4)
    {
	this.key = this.key.toUpperCase();
	this.key = this.key.replace(/ /g, '');
        nkey = base32.encode(base32.decode(this.key));
    }
    else
        nkey = this.key;

    return (nkey == this.key);
}

Account.prototype.output = function()
{
    if (this.type == 5 || this.digits == 10)
        return "hex40";
    else if (this.digits == 6)
        return "dec6";
    else if (this.digits == 7)
        return "dec7";
    else if (this.digits == 8)
        return "dec8";
}

Account.prototype.input = function()
{
    if (this.type == 3 || this.type == 4)
        return base32.decode(this.key);
    else
        return this.key;
}

Account.prototype.next = function()
{
    if (this.type == 1 || this.type == 4 || this.type == 5)
        this.counter++;

    this.gen();
};

Account.prototype.gen = function()
{
    if (this.type == 1 || this.type == 4 || this.type == 5)
        this.gen_hotp();
    else
        this.gen_totp();
};

Account.prototype.gen_hotp = function()
{
    this.current = hotp(
        this.input(),
        this.counter,
        this.output()
    );
};

Account.prototype.gen_totp = function()
{
    this.current = hotp(
        this.input(),
        Math.floor((new Date().getTime() / 1000) / this.period),
        this.output()
    );
};

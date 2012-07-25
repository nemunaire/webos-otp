function Account(type, label, key)
{
    this.type = type;
    this.label = label;
    this.key = key;
    this.digits = 6;
    this.counter = 0;
    this.period = 30;
    this.current = "test";
}

Account.prototype.next = function()
{
    if (this.type == "hotp")
        this.counter++;

    this.gen();
};

Account.prototype.gen = function()
{
    if (this.type == "hotp")
        this.gen_hotp();
    else
        this.gen_totp();
};

Account.prototype.gen_hotp = function()
{
    this.current = hotp(this.key, this.counter);
};

Account.prototype.gen_totp = function()
{
    Mojo.Log.error(this.key)
    this.current = hotp(this.key, Math.floor((new Date().getTime() / 1000) / this.period));
};

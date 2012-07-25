function MainAssistant()
{
    this.accountsDB = new Mojo.Depot(
        { name: "accounts" },
        this.dbOpenOK.bind(this),
        this.dbOpenFail.bind(this));

    this.accounts = [];

    this.addEventHandler = this.addAccount.bind(this);
    this.deleteEventHandler = this.delAccount.bind(this)
}

MainAssistant.prototype.setup = function()
{
    this.controller.setupWidget(
        'accountsList',
        {
            addItemLabel: "Add account...",
            autoconfirmDelete: false,
            itemTemplate: "first/accountTemplate",
            swipeToDelete: true,
            reorderable: false
        },
        {});
    this.controller.listen(
        this.controller.get("accountsList"),
        Mojo.Event.listTap,
        this.updateAccount.bind(this));
    this.controller.listen(
        this.controller.get("accountsList"),
        Mojo.Event.listAdd,
        this.addEventHandler);
    this.controller.listen(
        this.controller.get("accountsList"),
        Mojo.Event.listDelete,
        this.deleteEventHandler);
};

MainAssistant.prototype.dbOpenOK = function()
{
    this.accountsDB.get(
        "accountsList",
        this.updateList.bind(this),
        this.useDefaultList.bind(this)
    );
};

MainAssistant.prototype.updateList = function(l)
{
    if (l == null)
        this.useDefaultList();
    else
    {
        for (var i = 0; i < l.length; i++)
        {
            var a = new Account(l[i].type, l[i].label, l[i].key);
            a.digits = l[i].digits;
            a.counter = l[i].counter;
            a.period = l[i].period;
            a.gen();
            this.accounts.push(a);
        }
        this.loadList();
    }
};

MainAssistant.prototype.useDefaultList = function()
{
    this.accounts = [
        new Account("hotp", "Test-HOTP", "12345678901234567890"),
        new Account("totp", "Test-TOTP", "12345678901234567890")
    ];

    this.loadList();
};

MainAssistant.prototype.loadList = function()
{
    var minPeriod = 100;
    for (var i = 0; i < this.accounts.length; i++)
    {
        if (minPeriod > this.accounts[i].period)
            minPeriod = this.accounts[i].period;
        this.accounts[i].gen()
    }

    $('accountsList').mojo.noticeUpdatedItems(0, this.accounts);

    //Refresh all password at the end of the minimal period
    setTimeout(this.loadList.bind(this), minPeriod * 1000 - new Date().getTime() % (minPeriod * 1000))
}

MainAssistant.prototype.dbOpenFail = function()
{
    Mojo.Controller.errorDialog("Can't open accounts database (#" + result.message + ").");
};

MainAssistant.prototype.updateAccount = function(e)
{
    e.item.next();

    this.accountsDB.add(
        "accountsList",
        this.accounts,
        function() { Mojo.Log.error("........","accountsList saved OK"); },
        function(transaction,result) { Mojo.Controller.errorDialog("Database save error (#" + result.message + ") - can't save accounts list."); }
    );

    $('accountsList').mojo.noticeUpdatedItems(e.index, [e.item]);
};

MainAssistant.prototype.addAccount = function(e)
{
    Mojo.Log.error("add", e);
};

MainAssistant.prototype.delAccount = function(e)
{
    this.accounts.remove(e.index);
};

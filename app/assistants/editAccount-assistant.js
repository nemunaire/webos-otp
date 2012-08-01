function EditAccountAssistant(accountsDB, accounts, editingId)
{
    this.accounts = accounts;
    this.accountsDB = accountsDB;

    if (editingId == undefined)
        $("pagetitle").innerHTML = $L("Add account");
    else
    {
        $("pagetitle").innerHTML = $L("Edit account");
        this.editingId = editingId;
    }
}

EditAccountAssistant.prototype.setup = function()
{
    //Account
    this.controller.setupWidget(
        'label',
        {
            hintText: $L('user@example.com'),
            textCase: Mojo.Widget.steModeLowerCase,
            autoReplace: false,
            autoFocus: true,
            changeOnKeyPress: true
        },
        { value: "" }
    );
    this.controller.setupWidget(
        'key',
        {
            hintText: $L('Enter your key'),
            textCase: Mojo.Widget.steModeLowerCase,
            autoReplace: false,
            changeOnKeyPress: true
        },
        { value: "" }
    );

    //Parameters
    this.controller.setupWidget(
        "servicesList",
        {
            label: "Service",
            choices: [
                {label: "HTOP", value: 1},
                {label: "TOTP", value: 2},
                {label: "Google Authenticator", value: 3},
                {label: "Google Authenticator Counter", value: 4},
                {label: "ootp", value: 5}
            ]
        },
        this.servicesModel = { value: 3 }
    );
    this.controller.setupWidget(
        "algorithmsList",
        {
            label: "Algorithm",
            choices: [
                {label: "SHA1", value: 1},
                {label: "SHA256", value: 2},
                {label: "SHA512", value: 3},
                {label: "MD5", value: 4}
            ]
        },
        this.algorithmsModel = { value: 1, disabled: true }
    );
    this.controller.setupWidget(
        "digitsList",
        {
            label: "Output digits",
            choices: [
                {label: "6", value: 6},
                {label: "7", value: 7},
                {label: "8", value: 8},
                {label: "10 hex", value: 10}
            ]
        },
        this.digitsModel = { value: 6 }
    );

    //Buttons
    this.controller.setupWidget(
        'addButton',
        {label: (this.editingId !== undefined)?'Modify account':'Add account'},
        this.addBtModel = { buttonClass: 'affirmative', disabled: true }
    );
    this.controller.setupWidget(
        'cancelButton',
        { label: 'Cancel' },
        { buttonClass: 'secondary' }
    );

    //Events
    this.controller.listen(
        this.controller.get("label"),
        Mojo.Event.propertyChange,
        this.chAccount.bind(this));
    this.controller.listen(
        this.controller.get("key"),
        Mojo.Event.propertyChange,
        this.chAccount.bind(this));
    this.controller.listen(
        this.controller.get("addButton"),
        Mojo.Event.tap,
        this.addAccount.bind(this));
    this.controller.listen(
        this.controller.get("cancelButton"),
        Mojo.Event.tap,
        this.controller.stageController.popScene.bind(
        this.controller.stageController));

};

EditAccountAssistant.prototype.chAccount = function(e)
{
    if ($("label").mojo.getValue().length > 1
        && $("key").mojo.getValue().length > 5)
        this.addBtModel.disabled = false;
    else
        this.addBtModel.disabled = true;
    this.controller.modelChanged(this.addBtModel);
};

EditAccountAssistant.prototype.addAccount = function(e)
{
    var a = new Account(
        this.servicesModel.value,
        $("label").mojo.getValue(),
        $("key").mojo.getValue());
    a.digits = this.digitsModel.value;
/*    a.counter = $("pc").mojo.getValue();
    a.period = $("pc").mojo.getValue();*/
    this.accounts.push(a);

    this.accountsDB.add(
        "accountsList",
        this.accounts
    );

    this.controller.stageController.popScene();
};

EditAccountAssistant.prototype.cleanup = function(event)
{
};

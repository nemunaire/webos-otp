function StageAssistant() {}

StageAssistant.prototype.setup = function()
{
    this.controller.setWindowOrientation('free');
    this.controller.pushScene("main");
};

StageAssistant.prototype.handleCommand = function(event)
{
    if (event.type === Mojo.Event.command)
    {
        var stageController = this.controller;
        switch (event.command)
        {
        case 'do-myAddAccount':
            stageController.pushScene('editAccount');
            break;
        case 'do-myAbout':
            stageController.pushScene('about');
            break;
        }
    }
};

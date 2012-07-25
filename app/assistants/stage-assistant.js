function StageAssistant() {}

StageAssistant.prototype.setup = function()
{
    this.controller.setWindowOrientation('free');
    this.controller.pushScene("main");
};

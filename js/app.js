// Run and bootstrap MVC lifecycle structure on DOM content load
document.addEventListener('DOMContentLoaded', () => {
    const appModel = new ZenCountModel();
    const appView = new ZenCountView();
    const appController = new ZenCountController(appModel, appView);
    
    console.log("ZenCount Application successfully initialized under MVC architecture.");
});
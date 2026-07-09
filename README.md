# 🎯 ZenCount - Simple Manual Counting Tool

ZenCount ဆိုသည်မှာ ပရိတ်တော်များတစ်ခြားရွတ်ဖတ်ရသည့်တရားများကို ရေတွက်ရင်းနဲ့ စိတ်အေးချမ်းသာစွာဖြင့် တိကျသေချာစွာ Manual စနစ်ဖြင့် ရေတွက်နိုင်ရန် ဒီဇိုင်းထုတ်ထားသော ရိုးရှင်းသန့်ရှင်းသည့် Web-based Tool တစ်ခုဖြစ်ပါသည်။

---

## ✨ Features (အဓိက လုပ်ဆောင်ချက်များ)

* **Dual Counting Modes:** * **Count Using PDF / Image:** PDF စာအုပ်များ သို့မဟုတ် ရုပ်ပုံဖိုင်များ (PNG, JPG) ကို တိုက်ရိုက်တင်၍ ဖတ်ရှုရင်း ဘေးမှတွဲဖက် ရေတွက်နိုင်ခြင်း။
  * **Manual Counting:** မည်သည့်ဖိုင်မှ တင်ရန်မလိုဘဲ ရိုးရှင်းစွာ တိုက်ရိုက်ရေတွက်နိုင်ခြင်း။
* **Strict Session Control:** `Stop` ခလုတ်ကို နှိပ်လိုက်ပါက Counter နှင့် Timer လုပ်ငန်းစဉ်တစ်ခုလုံးကို အလိုအလျောက် Freeze ပြုလုပ်ပေးပြီး ရပ်တန့်ပေးခြင်း (`Reset` နှိပ်မှသာ အစမှပြန်စမည်ဖြစ်သည်)။
* **Live Session Timer:** ရေတွက်နေသည့် ကြာမြင့်ချိန်ကို စက္ကန့်မပြတ် တိကျစွာ ပြသပေးခြင်း။
* **Zen & Minimalist Design:** အာရုံစူးစိုက်မှု ကောင်းမွန်စေရန် Clean & Minimalist UI ကို အခြေခံ၍ တည်ဆောက်ထားခြင်း။

---

## 📂 Project Structure (ပရောဂျက် တည်ဆောက်ပုံ)

ဤ Project ကို ရေရှည်ထိန်းသိမ်းရ လွယ်ကူစေရန် **MVC (Model-View-Controller) Architecture** အတိုင်း စနစ်တကျ ခွဲခြားရေးသားထားပါသည် -

```text
zencount/
│
├── index.html               # View: UI Layout & Structure (Bootstrap 5)
├── css/
│   └── style.css            # Custom Styling & Colors (Zen Design)
└── js/
    ├── app.js               # Main Entry & App Initialization
    ├── model.js             # Model: Core Data Logic (Count, Timer, State)
    ├── view.js              # View Handler: DOM Manipulation & Alerts
    └── controller.js        # Controller: Event Listeners & Business Logic
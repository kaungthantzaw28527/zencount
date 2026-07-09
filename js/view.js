class ZenCountView {
    constructor() {
        // UI Screens Elements
        this.dashboard = document.getElementById('sectionDashboard');
        this.workspace = document.getElementById('sectionWorkspace');
        this.viewerContainer = document.getElementById('viewerContainer');
        this.counterContainer = document.getElementById('counterContainer');
        
        // Interactive Elements
        this.backBtn = document.getElementById('btnBack');
        this.subTitleMode = document.getElementById('subTitleMode');
        this.txtCounter = document.getElementById('txtCounter');
        this.txtTimer = document.getElementById('txtTimer');
        this.txtStatus = document.getElementById('txtStatus');
        this.imageViewer = document.getElementById('imageViewer');
        this.pdfViewer = document.getElementById('pdfViewer');
        
        this.btnIncrement = document.getElementById('btnCountIncrement');
        this.btnStop = document.getElementById('btnStop');
        this.btnPause = document.getElementById('btnPause');
        this.btnReset = document.getElementById('btnReset');
        
        // Toast Elements
        this.toastEl = document.getElementById('validationToast');
        this.toastMsg = document.getElementById('toastMessage');
        this.bsToast = new bootstrap.Toast(this.toastEl);
    }

    showToast(message, isDanger = true) {
        this.toastMsg.innerText = message;
        if(isDanger) {
            this.toastEl.classList.replace('bg-success', 'bg-danger');
        } else {
            this.toastEl.classList.replace('bg-danger', 'bg-success');
        }
        this.bsToast.show();
    }

    renderWorkspace(mode, fileUrl = null, fileType = null) {
        this.dashboard.classList.add('d-none');
        this.workspace.classList.remove('d-none');
        this.backBtn.classList.remove('d-none');
        this.subTitleMode.classList.remove('d-none');

        if (mode === 'split') {
            this.subTitleMode.innerText = "Count Using PDF / Image";
            this.viewerContainer.classList.remove('d-none');
            this.counterContainer.classList.replace('col-lg-12', 'col-lg-4');
            
            if (fileType === 'pdf') {
                this.imageViewer.classList.add('d-none');
                
                const pdfContainer = document.getElementById('pdfViewer');
                pdfContainer.classList.remove('d-none');

                // 💡 [အဓိကပြင်ဆင်ချက်] PDFObject ကို သုံးပြီး PDF.js Online Viewer ထဲသို့ တွန်းပို့ကာ ဖုန်းပေါ်တွင်ပါ Scroll ရစေခြင်း
                PDFObject.embed(fileUrl, "#pdfViewer", {
                    forcePDFJS: true, // မိုဘိုင်းလ်ဖုန်း browser တိုင်းတွင် PDF.js သုံးရန် force လုပ်ခြင်း
                    PDFJS_URL: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/web/viewer.html"
                });

            } else {
                this.imageViewer.src = fileUrl;
                this.imageViewer.classList.remove('d-none');
                document.getElementById('pdfViewer').classList.add('d-none');
            }
        } else {
            this.subTitleMode.innerText = "Manual Counting";
            this.viewerContainer.classList.add('d-none');
            this.counterContainer.classList.replace('col-lg-4', 'col-lg-12');
        }
    }

    setPauseUI(isPaused) {
        if (isPaused) {

            this.btnPause.innerHTML = `<i class="bi bi-play-fill"></i> Resume`;
            if (this.btnPause.classList.contains('btn-outline-warning')) {
                this.btnPause.classList.replace('btn-outline-warning', 'btn-warning');
            }
            
            this.btnStop.disabled = true;
            this.btnReset.disabled = true;
            this.btnIncrement.disabled = true;
            this.btnStop.classList.add('opacity-50');
            this.btnReset.classList.add('opacity-50');
            this.btnIncrement.classList.add('opacity-50');
        } else {

            this.btnPause.innerHTML = `<i class="bi bi-pause-fill"></i> Pause`;
            if (this.btnPause.classList.contains('btn-warning')) {
                this.btnPause.classList.replace('btn-warning', 'btn-outline-warning');
            }
            
            this.btnStop.disabled = true;
            this.btnPause.disabled = true;
            this.btnIncrement.disabled = true;
            this.btnReset.disabled = false;
            
            this.btnStop.classList.add('opacity-50');
            this.btnPause.classList.add('opacity-50');
            this.btnIncrement.classList.add('opacity-50');
            this.btnReset.classList.remove('opacity-50');
        }
    }


    resetUI() {
        this.dashboard.classList.remove('d-none');
        this.workspace.classList.add('d-none');
        this.backBtn.classList.add('d-none');
        this.subTitleMode.classList.add('d-none');
        this.txtCounter.innerText = "0000";
        this.txtTimer.innerText = "00:00:00";
        this.txtStatus.innerText = "Waiting...";
        
        // 💡 iframe သို့ ပြန်ပြောင်းသွားသဖြင့် src ကိုသာ ရှင်းပေးရန် လိုအပ်ပါသည်
        this.pdfViewer.src = "";
        this.imageViewer.src = "";
        
        this.btnStop.disabled = false;
        this.btnPause.disabled = false;
        this.btnIncrement.disabled = false;
        this.btnReset.disabled = false;
        
        this.btnStop.classList.remove('opacity-50');
        this.btnPause.classList.remove('opacity-50');
        this.btnIncrement.classList.remove('opacity-50');
        this.btnReset.classList.remove('opacity-50');
        
        this.setPauseUI(false);
    }

    updateMetrics(countStr, timeStr, statusText) {
        this.txtCounter.innerText = countStr;
        this.txtTimer.innerText = timeStr;
        this.txtStatus.innerText = statusText;
    }
}
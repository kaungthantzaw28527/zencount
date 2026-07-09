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
                this.pdfViewer.src = fileUrl;
                this.pdfViewer.classList.remove('d-none');
                this.imageViewer.classList.add('d-none');
            } else {
                this.imageViewer.src = fileUrl;
                this.imageViewer.classList.remove('d-none');
                this.pdfViewer.classList.add('d-none');
            }
        } else {
            this.subTitleMode.innerText = "Manual Counting";
            this.viewerContainer.classList.add('d-none');
            this.counterContainer.classList.replace('col-lg-4', 'col-lg-12');
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
        this.pdfViewer.src = "";
        this.imageViewer.src = "";
    }

    updateMetrics(countStr, timeStr, statusText) {
        this.txtCounter.innerText = countStr;
        this.txtTimer.innerText = timeStr;
        this.txtStatus.innerText = statusText;
    }
}
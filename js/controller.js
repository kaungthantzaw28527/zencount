class ZenCountController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.initEventListeners();
    }

    initEventListeners() {
        // Mode Triggers
        document.getElementById('btnStartManual').addEventListener('click', () => this.startManualMode());
        document.getElementById('btnUploadTrigger').addEventListener('click', () => document.getElementById('fileInput').click());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelection(e.target.files[0]));

        // Drag and Drop Logic Handler
        const dropZone = document.getElementById('dropZone');
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) this.handleFileSelection(e.dataTransfer.files[0]);
        });

        // Core Workspace Interface Controls
        document.getElementById('btnCountIncrement').addEventListener('click', () => this.handleIncrement());
        document.getElementById('btnStop').addEventListener('click', () => this.handleStop());
        document.getElementById('btnReset').addEventListener('click', () => this.handleReset());
        this.view.backBtn.addEventListener('click', () => this.handleBack());
    }

    startManualMode() {
        this.view.renderWorkspace('manual');
    }

    handleFileSelection(file) {
        if (!file) return;

        // Security Restriction & Verification Check
        if (!this.model.validateFile(file.name)) {
            this.view.showToast(`Error: File type profile not supported. Please upload PDF, PNG, JPG, or JPEG only.`);
            return;
        }

        const fileType = file.type.includes('pdf') ? 'pdf' : 'image';
        // Memory cleaning protection check
        if (this.model.uploadedFileUrl) URL.revokeObjectURL(this.model.uploadedFileUrl);
        
        this.model.uploadedFileUrl = URL.createObjectURL(file);
        this.model.uploadedFileType = fileType;

        this.view.renderWorkspace('split', this.model.uploadedFileUrl, fileType);
    }

    handleIncrement() {
        if (this.model.startTime !== null && !this.model.isActive) {
            return; 
        }

        this.model.incrementCounter();
        if (!this.model.timerIntervalId) {
            this.model.timerIntervalId = setInterval(() => this.updateTimerLogic(), 100);
        }
        this.view.updateMetrics(this.model.getFormattedCount(), this.formatTime(this.model.elapsedTime), "Counting...");
    }

    updateTimerLogic() {
        if (this.model.isActive) {
            this.model.elapsedTime = Date.now() - this.model.startTime;
            this.view.updateMetrics(this.model.getFormattedCount(), this.formatTime(this.model.elapsedTime), "Counting...");
        }
    }

    handleStop() {
        this.model.stopCounter();
        this.view.updateMetrics(this.model.getFormattedCount(), this.formatTime(this.model.elapsedTime), "Session Paused");
        document.getElementById('btnCountIncrement').classList.add('opacity-50');
    }

    handleReset() {
        const savedUrl = this.model.uploadedFileUrl;
        const savedType = this.model.uploadedFileType;
        this.model.stopCounter();
        this.model.resetState();
        this.model.uploadedFileUrl = savedUrl;
        this.model.uploadedFileType = savedType;
        this.view.updateMetrics("0000", "00:00:00", "Waiting...");
        document.getElementById('btnCountIncrement').classList.remove('opacity-50');
    }

    handleBack() {
        this.model.stopCounter();
        if (this.model.uploadedFileUrl) {
            URL.revokeObjectURL(this.model.uploadedFileUrl);
        }
        this.model.resetState();
        this.view.resetUI();
    }

    formatTime(ms) {
        let totalSeconds = Math.floor(ms / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}
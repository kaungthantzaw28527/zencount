class ZenCountModel {
    constructor() {
        this.resetState();
        this.allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
    }

    resetState() {
        this.currentCount = 0;
        this.startTime = null;
        this.elapsedTime = 0; // Duration in milliseconds
        this.timerIntervalId = null;
        this.isActive = false;
        this.isPaused = false;
        this.uploadedFileUrl = null;
        this.uploadedFileType = null; // 'pdf' or 'image'
    }

    incrementCounter() {
        if (!this.isActive) {
            this.isActive = true;
            this.startTime = Date.now() - this.elapsedTime;
        }
        this.currentCount++;
        return this.currentCount;
    }

    stopCounter() {
        this.isActive = false;
        this.isPaused = false;
        if (this.timerIntervalId) {
            clearInterval(this.timerIntervalId);
            this.timerIntervalId = null;
        }
    }

    getFormattedCount() {
        return String(this.currentCount).padStart(4, '0');
    }

    // Security Verification Check
    validateFile(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        return this.allowedExtensions.includes(extension);
    }
}
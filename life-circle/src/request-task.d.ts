// onProgressUpdate for RequestTask
declare namespace wx {
    export interface RequestTask {
        onProgressUpdate: wx.DownloadTask['onProgressUpdate']
    }
}
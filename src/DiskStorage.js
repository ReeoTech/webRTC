
// __________(indexed-db)
// DiskStorage.js

/**
 * DiskStorages is a standalone object used by {@link reeoTech} to store recorded blobs in IndexedDB storage.
 * @summary Writing blobs into IndexedDB.
 * @author {@link trkhanh8@gmail.com}
 * @example
 * DiskStorage.Store({
 *      audioBlob: yourAudioBlob,
 *      videoBlob: yourVideoBlob,
 *      gifBlob  : yourGifBlob,
 * });
 * DiskStorage.Fetch(function(dataURL, type){
 *      if(type === 'audioBlob'){ }
 *      if(type === 'videoBlob'){ }
 *      if(type === 'gifBlob'){ }
 * })
 * DiskStorage.dataStoreName = 'webrtcRecord'
 * DiskStorage.onError = function(error) { };
 * @property {function} init - This method must be called once to initialize IndexedDB ObjectStorage. Through, it is auto- used internally.
 * @property {function} Fetch - This method fetches stored blobs from IndexedDB
 * @property {function} Store - This method stores blobs in IndexedDb.
 * @property {function} onError - This function is invoked for any known/unknown error.
 * @property {string} dataStoreName - Name of the ObjectStore created in IndexedDB storage.
 * @see {@link https://github.com/trkhanh/recordRTC}
 * 
 */

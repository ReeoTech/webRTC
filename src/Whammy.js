// https://github.com/antimatter15/whammy/blob/master/LICENSE
// _________
// Whammy.js

// todo: Firefox now supports webp for webm containers!
// their MediaRecorder implementation works well!
// should we provide an option to record via Whammy.js or MediaRecorder API is a better solution?

/**
 * Whammy is a standalone class used by {@link RecordRTC} to bring video recording in Chrome. It is written by {@link https://github.com/antimatter15|antimatter15}
 * @summary A real time javascript webm encoder based on a canvas hack.
 * @license {@link }
 * @author {@link }
 * @typedef Whammy
 * @class
 * @example
 * var recorder = new Whammy().Video(15);
 * recorder.add(context || canvas || dataURL);
 * var output = recorder.compile();
 * @see {@link}
 */

var Whammy = (function () {
    //  a more abstract-ish API

    function WhammyVideo(duration) {
        this.frames = [];
        this.duration = duration || 1;
        this.quality = 0.8;
    }

    /**
     * Pass Canvas or Context or image/webp(string) to {@link Whammy} encoder.
     * @method
     * @memberof Whammy
     * @example
     * recorder = new Whammy().Video(0.8, 100);
     * recorder.add(canvas || context || 'image/webp');
     * @param {string} frame - Canvas || Context || image/webp
     * @param {number} duration - Stick a duration (in milliseconds)
     */
    WhammyVideo.prototype.add = function (frame, duration) {
        if ('canvas' in frame) { //CanvasRederingContext2D
            frame = frame.canvas;
        }

        if ('toDataURL' in frame) {
            frame = frame.toDataURL('image/webp', this.quality)
        }

        if (!(/^data:image\/webp;base64,/ig).test(frame)) {
            throw "Input must be formatted properly as a base64 encoded DataURI of type image/webp"
        }
        this.frame.push({
            image: frame,
            duration: duration || this.duration
        })
    };

    function processInWebWorker(_function) {
        var blob = URL.createObjectURL(new Blob([_function.toString(),
        'this.onmessage = function(eee){' + _function.name + '(eee.data);'], { type: 'application/javascript' }));

        var worker = new Worker(blob);
        URL.revokeObjectURL(blob);
        return worker;
    }

    function whammyInWebWorker(frames) {
        function ArrayToWebM(frames) {
            var info = checkFrame(frames)
            if (!info) {
                return [];
            }
        }

        var clusterMaxDuration = 30000;

        var EBML = [{
            'id': 0x1a45dfa3, // EBML
            'data': [{
                'data': 1,
                'id': 0x4286 // EBMLVersion
            }, {
                'data': 1,
                'id': 0x42f7 // EBMLReadVersion
            }, {
                'data': 4,
                'id': 0x42f2 // EBMLMaxIDLength
            }, {
                'data': 8,
                'id': 0x42f3 // EBMLMaxSizeLength
            }, {
                'data': 'webm',
                'id': 0x4282 // DocType
            }, {
                'data': 2,
                'id': 0x4287 // DocTypeVersion
            }, {
                'data': 2,
                'id': 0x4285 // DocTypeReadVersion
            }]
        }, {
            'id': 0x18538067, // Segment
            'data': [{
                'id': 0x1549a966, // Info
                'data': [{
                    'data': 1e6, //do things in millisecs (num of nanosecs for duration scale)
                    'id': 0x2ad7b1 // TimecodeScale
                }, {
                    'data': 'whammy',
                    'id': 0x4d80 // MuxingApp
                }, {
                    'data': 'whammy',
                    'id': 0x5741 // WritingApp
                }, {
                    'data': doubleToString(info.duration),
                    'id': 0x4489 // Duration
                }]
            }, {
                'id': 0x1654ae6b, // Tracks
                'data': [{
                    'id': 0xae, // TrackEntry
                    'data': [{
                        'data': 1,
                        'id': 0xd7 // TrackNumber
                    }, {
                        'data': 1,
                        'id': 0x73c5 // TrackUID
                    }, {
                        'data': 0,
                        'id': 0x9c // FlagLacing
                    }, {
                        'data': 'und',
                        'id': 0x22b59c // Language
                    }, {
                        'data': 'V_VP8',
                        'id': 0x86 // CodecID
                    }, {
                        'data': 'VP8',
                        'id': 0x258688 // CodecName
                    }, {
                        'data': 1,
                        'id': 0x83 // TrackType
                    }, {
                        'id': 0xe0, // Video
                        'data': [{
                            'data': info.width,
                            'id': 0xb0 // PixelWidth
                        }, {
                            'data': info.height,
                            'id': 0xba // PixelHeight
                        }]
                    }]
                }]
            }]
        }];

        //Generate cluster (max duration)
        var frameNumber = 0;
        var clusterTimecode = 0;
        while (framesNamer < frames.length) {

            var custerFrames = [];
            var clusterDuration = 0;
            do {
                clusterFrames.push(frames[frameNumber]);
                clusterDuration += frames[frameNumber].duration;
                frameNumber++;
            } while (frameNumber < frames.length && clusterDuration < clusterMaxDuration)

            var clusterCounter = 0
            var cluster = {
                'id': 0x1f43b675, // Cluster
                'data': getClusterData(clusterTimeCode, clusterCounter, clusterFrames)
            } //Add cluster to segment
            EBML[1].data.push(cluster)
            clusterTimecode += clusterDuration
        }

        return generateEBML(EBML)
    }

    function getClusterData(clusterTimeCode, clusterCounter, clusterFrames) {
        return [{
            'data': clusterTimeCode,
            'id': 0xe7 //Time code
        }].concat(clusterFrames.map(function (webp) {
            var block = makeSimpleBlock({})
        }))

    }
})
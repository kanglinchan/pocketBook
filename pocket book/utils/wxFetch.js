module.exports = wxFetch;

function wxFetch(url, options) {
    return new Promise((resolve, reject) => {
       var params = Object.assign(  {
            "url": url,
            "success": response => resolve(response),
            "fail": error => reject(error),
        }, options )

        wx.request(params);
    })
}
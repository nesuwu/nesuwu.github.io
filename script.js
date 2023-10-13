// prettier-ignore
function _0x2508(){const _0x7ffec1=['change','querySelector','8790929WjdtYn','327370bHblEE','add','append','37390474nEvAwx','disabled','Błąd\x20podczas\x20przesyłania\x20pliku,\x20nie\x20wiem\x20co\x20jest\x20nie\x20tak','20iLttbe','none','choose-file-true','getElementById','remove','file','9WhNJOZ','reqtype','1829874dEhXqA','href','classList','6jsWXaT','click','addEventListener','.submit-button','style','1246584wIapqq','userhash','value','https://catbox.moe/user/api.php','1ZxYxOK','display','location','block','11296680sWbPve','1835752wSWmjt','POST','fileupload','https://files.catbox.moe/'];_0x2508=function(){return _0x7ffec1;};return _0x2508();}
function _0x4013(_0x8ce05d, _0x4c8d3b) {
  const _0x2508c3 = _0x2508();
  return (
    (_0x4013 = function (_0x4013b9, _0x183437) {
      _0x4013b9 = _0x4013b9 - 0x1c1;
      let _0x436463 = _0x2508c3[_0x4013b9];
      return _0x436463;
    }),
    _0x4013(_0x8ce05d, _0x4c8d3b)
  );
}
const _0x4f407c = _0x4013;
(function (_0x49d2a9, _0xf47540) {
  const _0x5259f0 = _0x4013,
    _0x23b37a = _0x49d2a9();
  while (!![]) {
    try {
      const _0x21fba1 =
        (parseInt(_0x5259f0(0x1e4)) / 0x1) *
          (parseInt(_0x5259f0(0x1d8)) / 0x2) +
        -parseInt(_0x5259f0(0x1e0)) / 0x3 +
        (-parseInt(_0x5259f0(0x1d0)) / 0x4) *
          (parseInt(_0x5259f0(0x1ca)) / 0x5) +
        (parseInt(_0x5259f0(0x1db)) / 0x6) *
          (-parseInt(_0x5259f0(0x1c9)) / 0x7) +
        (parseInt(_0x5259f0(0x1c3)) / 0x8) *
          (-parseInt(_0x5259f0(0x1d6)) / 0x9) +
        -parseInt(_0x5259f0(0x1c2)) / 0xa +
        parseInt(_0x5259f0(0x1cd)) / 0xb;
      if (_0x21fba1 === _0xf47540) break;
      else _0x23b37a["push"](_0x23b37a["shift"]());
    } catch (_0x5db205) {
      _0x23b37a["push"](_0x23b37a["shift"]());
    }
  }
})(_0x2508, 0xe971d);
const fileUpload = document[_0x4f407c(0x1d3)](_0x4f407c(0x1c5)),
  submitButton = document[_0x4f407c(0x1c8)](_0x4f407c(0x1de)),
  submitButtonOverlay = document[_0x4f407c(0x1c8)](".submit-button-overlay"),
  userhash = "7408f8f9f9f79ab31bf39765d";
fileUpload[_0x4f407c(0x1dd)](_0x4f407c(0x1c7), () => {
  const _0x28ffe4 = _0x4f407c;
  fileUpload[_0x28ffe4(0x1e2)]
    ? ((submitButton[_0x28ffe4(0x1ce)] = ![]),
      submitButton[_0x28ffe4(0x1da)]["add"](_0x28ffe4(0x1d2)),
      fileUpload[_0x28ffe4(0x1da)][_0x28ffe4(0x1cb)](_0x28ffe4(0x1d2)),
      (submitButtonOverlay[_0x28ffe4(0x1df)]["display"] = _0x28ffe4(0x1d1)))
    : ((submitButton[_0x28ffe4(0x1ce)] = !![]),
      submitButton["classList"]["remove"](_0x28ffe4(0x1d2)),
      fileUpload[_0x28ffe4(0x1da)][_0x28ffe4(0x1d4)](_0x28ffe4(0x1d2)),
      (submitButtonOverlay[_0x28ffe4(0x1df)][_0x28ffe4(0x1e5)] =
        _0x28ffe4(0x1c1)));
}),
  submitButton["addEventListener"](_0x4f407c(0x1dc), async () => {
    const _0x141fed = _0x4f407c,
      _0x4e83a6 = fileUpload["files"][0x0],
      _0x266bbb = new FormData();
    _0x266bbb["append"](_0x141fed(0x1d5), _0x4e83a6),
      _0x266bbb[_0x141fed(0x1cc)](_0x141fed(0x1d7), "fileupload"),
      _0x266bbb[_0x141fed(0x1cc)](_0x141fed(0x1e1), userhash);
    const _0x24d08c = await fetch(_0x141fed(0x1e3), {
      method: _0x141fed(0x1c4),
      body: _0x266bbb,
    });
    if (_0x24d08c["ok"]) {
      const _0x4071c7 = await _0x24d08c["text"](),
        _0xcd9246 = _0x141fed(0x1c6) + _0x4071c7;
      window[_0x141fed(0x1e6)][_0x141fed(0x1d9)] = _0xcd9246;
    } else console["error"](_0x141fed(0x1cf));
  });

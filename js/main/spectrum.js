var TotalWidth = (Bar1080pWidth * SpectrumBarCount ) + (Bar1080pSeperation * (SpectrumBarCount - 1))
var TotalHeight = (Bar1080pWidth * BarHeightToWidthRatio) + LogoSpacing + LogoSize
var DivWidthToHeightRatio = TotalHeight/TotalWidth
var BarsHeightRatio = (Bar1080pWidth * BarHeightToWidthRatio)/TotalHeight
var LogoPosRatio = (LogoSpacing/TotalHeight) + BarsHeightRatio
var TextWidthRatio = (TotalWidth - LogoSpacing - LogoSize)/TotalWidth
var TextPosRatioLeft = (LogoSize + LogoSpacing)/TotalWidth
var TextPosRatioTop = ((LogoSpacing - LogoSize)/TotalHeight) + BarsHeightRatio

var Body = document.getElementById("Body")
var Canvas = document.getElementById("MainCanvas")
var Div = document.getElementById("MainDiv")
var AlbumImage = document.getElementById("AlbumImage")
var TextDiv = document.getElementById("TextDiv")
var MonstercatLogo = document.getElementById("MonstercatLogo")
var LowerTextDiv = document.getElementById("LowerTextDiv")
var LeftText = document.getElementById("LeftText")
var RightText = document.getElementById("RightText")
var LoadingDiv = document.getElementById("LoadingDiv")
var LoadingText = document.getElementById("LoadingText")
var AlbumTextDiv = document.getElementById("AlbumTextDiv")
var AlbumTitleText = document.getElementById("AlbumTitle")
var AlbumSongTitle1Text = document.getElementById("AlbumSongTitle1")
var AlbumSongTitle2Text = document.getElementById("AlbumSongTitle2")
var AlbumSongTitle3Text = document.getElementById("AlbumSongTitle3")
var BackgroundImage = document.getElementById("BackgroundImage")
var Link1 = document.getElementById("Link1")
var Link2 = document.getElementById("Link2")
var ColorBackground = document.getElementById("ColorBackground")
var ParticleBackground = document.getElementById("ParticleBackground")

var CanvasColor = Canvas.getContext("2d")

var RatioFromIntroStart = 0
var RatioFromStart = 0
var RatioFromIntroEnd = 0
var RatioFromEnd = 0
var RatioFromLogoStart = 0
var RatioFromTextStart = 0
var RatioFromLogoEnd = 0
var RatioFromTextEnd = 0
var LastFrame = 0

var SVGNameSpace = "http://www.w3.org/2000/svg"

var LastRenderedFrame = 0

function ResizeFrames(CurrentTime) {
  var Width = window.innerWidth
  var Height = window.innerHeight


  renderer.setSize(Width, Height);

  var BackgroundWidthRatio = Width/BackgroundWidth
  var BackgroundHeightRatio = Height/BackgroundHeight
  var BackgroundMult = Math.max(BackgroundWidthRatio,BackgroundHeightRatio)
  var NewBackgroundWidth = (BackgroundHeight*BackgroundMult)
  var NewBackgroundHeight = (BackgroundWidth*BackgroundMult)
  BackgroundImage.style.width = NewBackgroundHeight + "px"
  BackgroundImage.style.height = NewBackgroundWidth + "px"
  BackgroundImage.style.margin = "-" + NewBackgroundWidth/2 + "px 0 0 -" + NewBackgroundHeight/2 + "px";



  var WidthRatio = Width/(TotalWidth * (1 + (1 - WidthBoundArea)))
  var HeightRatio = Height/(TotalHeight * (1 + (1 - HeightBoundArea)))

  var Mult = 0
  if (WidthRatio > HeightRatio) {
    Mult = HeightRatio
  } else {
    Mult = WidthRatio
  }

  var NewHeight = TotalHeight * Mult
  var NewWidth = TotalWidth * Mult
  Div.height = NewHeight
  Div.width = NewWidth
  if (UseSVGOverCanvas == true) {
    MainSVG.style.height = NewHeight * BarsHeightRatio
    MainSVG.style.width = NewWidth
  } else {
    var ShowBlurSize = Math.floor(ShadowBlur * Mult)
    Canvas.height = NewHeight * BarsHeightRatio + (ShowBlurSize * 2)
    Canvas.width = NewWidth + (ShowBlurSize*2)
    Canvas.style.margin = "-" + ShowBlurSize + "px 0 0 -" + ShowBlurSize + "px"
  }

  Div.style.margin = "-" + NewHeight/2 + "px 0 0 -" + NewWidth/2 + "px"

  var NewLogoSize = LogoSize * Mult
  AlbumImage.style.height = NewLogoSize + "px"
  AlbumImage.style.top = (LogoPosRatio * NewHeight) + "px"
  MonstercatLogo.style.height = NewLogoSize*0.7 + "px"
  MonstercatLogo.style.top = (LogoPosRatio * NewHeight) + NewLogoSize*0.15 + "px"
  UpdateAlbumCover(CurrentTime,NewLogoSize)

  TextDiv.style.height = (NewLogoSize) + "px"
  TextDiv.style.top = (LogoPosRatio * NewHeight) + "px"
  TextDiv.style.left = (TextPosRatioLeft * NewWidth) + "px"

  var TextDivHeight = TextDiv.clientHeight
  if (TextDivHeight == 0) {
    TextDivHeight = AlbumTextDiv.clientHeight
  }
  ArtistText.style["font-size"] = (TextDivHeight * ArtistNameActualRatio) + "px"
  SongNameText.style["font-size"] = (TextDivHeight * SongNameActualRatio) + "px"

  AlbumTextDiv.style.height = (NewLogoSize) + "px"
  AlbumTextDiv.style.top = (LogoPosRatio * NewHeight) + "px"
  AlbumTextDiv.style.left = (TextPosRatioLeft * NewWidth) + "px"
  UpdateAlbumText(CurrentTime,NewWidth * TextWidthRatio)

  AlbumTitleText.style["font-size"] = (TextDivHeight * 0.2) + "px"
  AlbumSongTitle1Text.style["font-size"] = (TextDivHeight * 0.2) + "px"
  AlbumSongTitle2Text.style["font-size"] = (TextDivHeight * 0.2) + "px"
  AlbumSongTitle3Text.style["font-size"] = (TextDivHeight * 0.2) + "px"

  var TextMult = (NewWidth/1920)
  ArtistText.style["letter-spacing"] = (TextMult * -5.3) + "px"
  SongNameText.style["letter-spacing"] = (TextMult * -4) + "px"
  AlbumTitleText.style["letter-spacing"] = (TextMult * -2) + "px"
  AlbumSongTitle1Text.style["letter-spacing"] = (TextMult * -2) + "px"
  AlbumSongTitle2Text.style["letter-spacing"] = (TextMult * -2) + "px"
  AlbumSongTitle3Text.style["letter-spacing"] = (TextMult * -2) + "px"

  var ShadowMult = 0
  if (ShadowBlur > 0) {
    ShadowMult = TextMult
  }

  var TextDistance = Math.floor(ShadowMult * 3) + "px " + Math.floor(ShadowMult * 3) + "px "
  ArtistText.style["text-shadow"] = TextDistance + Math.floor(5 * ShadowMult) + "px #000000"
  SongNameText.style["text-shadow"] = TextDistance + Math.floor(3 * ShadowMult) + "px #000000"
  AlbumTitleText.style["text-shadow"] = TextDistance + Math.floor(2 * ShadowMult) + "px #000000"
  AlbumSongTitle1Text.style["text-shadow"] = TextDistance + Math.floor(2 * ShadowMult) + "px #000000"
  AlbumSongTitle2Text.style["text-shadow"] = TextDistance + Math.floor(2 * ShadowMult) + "px #000000"
  AlbumSongTitle3Text.style["text-shadow"] = TextDistance + Math.floor(2 * ShadowMult) + "px #000000"

  var LowerTextFontSize = LowerTextDiv.clientHeight + "px"
  LeftText.style["font-size"] = LowerTextFontSize
  RightText.style["font-size"] = LowerTextFontSize

  LoadingText.style["font-size"] = LoadingText.clientHeight + "px"
  return Mult
}

function Clamp(Number) {
  if (Number > 1) {
    return 1
  } else if (Number < 0) {
    return 0
  } else {
    return Number
  }
}

function EaseSineIn(Number) {
  return 1 - Math.cos(Number * 3.1415/2 )
}

function EaseSineOut(Number) {
  return Math.sin(Number * 3.1415/2 )
}

if (UseSVGOverCanvas == true) {
  var Bars = {}

  function CreateBar() {
    var Rect = document.createElementNS(SVGNameSpace,"rect");
    Rect.setAttributeNS(null,"x","0px");
    Rect.setAttributeNS(null,"y","0px");
    Rect.setAttributeNS(null,"height","0px");
    Rect.setAttributeNS(null,"width","0px");
    Rect.setAttributeNS(null,"fill","#FFFFFF");
    MainSVG.appendChild(Rect);
    return Rect
  }
  for (var i = 0; i < SpectrumBarCount; i++) {
    Bars[i] = CreateBar()
  }
  Bars["Left"] = CreateBar()
  Bars["Right"] = CreateBar()

  function FillRect(PosX,PosY,Width,Height,Id) {
    var Bar = Bars[Id]
    Bar.style.fill = GenreColor
    Bar.style.x = Math.round(PosX) + "px"
    Bar.style.y = Math.round(PosY) + "px"
    Bar.style.width = Math.round(Width) + "px"
    Bar.style.height = Math.round(Height) + "px"
  }
} else {
  function FillRect(PosX,PosY,Width,Height,Id) {
    CanvasColor.fillStyle = GenreColor
    CanvasColor.fillRect(PosX,PosY,Width,Height)
  }
}

function HandleAudio() {
  UpdateTextVisibility()
  if (StartTime == 0) {
    ResizeFrames(0,0)
    return
  }


  var Time = Date.now()
  var Frame = -1
  var SongTime = 0

  if (Paused == false) {
    SongTime = Time - StartTime - CurrentTimeOffset
    var TimeToEnd = TimeLength - SongTime

    var CurrentFrame = Math.floor(SongTime/1000 * FrameCap)
    if (CurrentFrame == LastRenderedFrame) { return }
    LastRenderedFrame = CurrentFrame

    Frame = Math.floor(SongTime/1000 * RecordFrequency)

    var SongTimeHalf = SongTime/500
    var TimeToEndHalf = TimeToEnd/500
    RatioFromIntroStart = Clamp(SongTimeHalf)
    RatioFromStart = Clamp(SongTimeHalf - 1)
    RatioFromIntroEnd = Clamp(TimeToEndHalf)
    RatioFromEnd = Clamp(TimeToEndHalf - 1)
  }



  var TimeMult = 1
  if (RatioFromIntroStart < 1 || RatioFromIntroEnd < 1) {
    TimeMult = 0
  } else if(RatioFromStart < 1) {
    TimeMult = RatioFromStart
  } else if(RatioFromEnd < 1) {
    TimeMult = RatioFromEnd
  }

  var Mult = ResizeFrames(SongTime)
  var NewHeight = 0
  var NewWidth = 0
  var ShowBlurSize = Math.floor(ShadowBlur * Mult)
  if (UseSVGOverCanvas == true) {
    var NewHeight = MainSVG.clientHeight
    var NewWidth = MainSVG.clientWidth
  } else {
    var NewHeight = Canvas.clientHeight - (ShowBlurSize*2)
    var NewWidth = Canvas.clientWidth - (ShowBlurSize*2)
  }

  var DataArray = new Uint8Array(Analyser.frequencyBinCount)
  Analyser.getByteFrequencyData(DataArray)
  var VisualData = GetVisualBins(DataArray)
  var TransformedVisualData = TransformToVisualBins(VisualData)

  var NewSeperation = Bar1080pSeperation * Mult
  var NewBarWidth = Bar1080pWidth * Mult

  if (EncodingEnabled == true) {
    if (Frame != -1 && LastFrame != Frame) {
      LastFrame = Frame
      CompiledSongData = CompiledSongData + "\n[" + Frame + "] = {"
      if (EncodeRawData == true) {
        for (var i = 0; i < SpectrumBarCount; i++) {
          var Height = VisualData[i]/255
          CompiledSongData = CompiledSongData + Math.floor(Height*RecordDownScale) + ","
        }
      } else {
        for (var i = 0; i < SpectrumBarCount; i++) {
          var Height = TransformedVisualData[i]/255
          CompiledSongData = CompiledSongData + Math.floor(Height*RecordDownScale) + ","
        }
      }
      CompiledSongData = CompiledSongData + "},"
    }
  }

  CanvasColor.shadowOffsetX = ShowBlurSize/2;
  CanvasColor.shadowOffsetY = ShowBlurSize/2;
  CanvasColor.fillStyle = GenreColor
  CanvasColor.shadowBlur = ShowBlurSize
  CanvasColor.shadowColor = "#000000"
  AlbumImage.style["background-color"] = GenreColor

  if (RatioFromIntroStart == 1 && RatioFromIntroEnd == 1 ) {
    if (UseSVGOverCanvas == true) {
      FillRect(0,0,0,0,"Left")
      FillRect(0,0,0,0,"Right")
    }
    if (DrawParticles == true) {
      ParticleBackground.style.opacity = 1
    }

    for (var i = 0; i < SpectrumBarCount; i++) {
      var Pos = (NewSeperation + NewBarWidth) * i + ShowBlurSize
      var Height = TransformedVisualData[i]/255 * NewHeight * TimeMult
      if (Height < 2) { Height = 2 }
      FillRect(Pos,NewHeight - Height,NewBarWidth,Height,i)
    }
  } else {
    if (RatioFromIntroStart < 1) {
      var HalfWidth = (NewWidth/2) * RatioFromIntroStart
      if (DrawParticles == true) {
        ParticleBackground.style.opacity = RatioFromIntroStart
      }

      if (HalfWidth > 0) {
        FillRect(0,NewHeight - 2,HalfWidth,2,"Left")
        FillRect((NewWidth - HalfWidth),NewHeight - 2,HalfWidth,2,"Right")
      }
    } else {
      var HalfWidth = (NewWidth/2) * RatioFromIntroEnd
      if (DrawParticles == true) {
        ParticleBackground.style.opacity = RatioFromIntroEnd
      }

      if (HalfWidth > 0) {
        FillRect(0,NewHeight - 2,HalfWidth,2,"Left")
        FillRect((NewWidth - HalfWidth),NewHeight - 2,HalfWidth,2,"Right")
      }
    }
  }
}






InitializeSpectrumHandler()
PlayRandomSong()

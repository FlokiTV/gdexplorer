export interface GameData {
    firstLayout:               string;
    gdVersion:                 GdVersion;
    properties:                Properties;
    resources:                 Resources;
    objects:                   Object[];
    objectsGroups:             ObjectsGroup[];
    variables:                 any[];
    layouts:                   EventsFunctionsExtension[];
    externalEvents:            any[];
    eventsFunctionsExtensions: EventsFunctionsExtension[];
    externalLayouts:           EventsFunctionsExtension[];
    externalSourceFiles:       any[];
}

export interface EventsFunctionsExtension {
    __REFERENCE_TO_SPLIT_OBJECT: boolean;
    referenceTo:                 string;
}

export interface GdVersion {
    build:    number;
    major:    number;
    minor:    number;
    revision: number;
}

export interface Object {
    assetStoreId:         string;
    name:                 string;
    tags:                 string;
    type:                 ObjectType;
    updateIfNotVisible?:  boolean;
    variables:            Variable[];
    effects:              Effect[];
    behaviors:            Behavior[];
    animations?:          Animation[];
    bold?:                boolean;
    italic?:              boolean;
    smoothed?:            boolean;
    underlined?:          boolean;
    string?:              string;
    font?:                string;
    textAlignment?:       string;
    characterSize?:       number;
    color?:               Color;
    fillOpacity?:         number;
    outlineSize?:         number;
    outlineOpacity?:      number;
    fillColor?:           Color;
    outlineColor?:        Color;
    absoluteCoordinates?: boolean;
    clearBetweenFrames?:  boolean;
    content?:             Content;
}

export interface Animation {
    name:                  string;
    useMultipleDirections: boolean;
    directions:            Direction[];
}

export interface Direction {
    looping:           boolean;
    timeBetweenFrames: number;
    sprites:           Sprite[];
}

export interface Sprite {
    hasCustomCollisionMask: boolean;
    image:                  string;
    points:                 any[];
    originPoint:            Point;
    centerPoint:            Point;
    customCollisionMask:    Array<CustomCollisionMask[]>;
}

export interface Point {
    automatic?: boolean;
    name:       Name;
    x:          number;
    y:          number;
}

export enum Name {
    Centre = "centre",
    Origine = "origine",
}

export interface CustomCollisionMask {
    x: number;
    y: number;
}

export interface Behavior {
    name:          string;
    type:          string;
    canBeGrabbed?: boolean;
    platformType?: string;
    yGrabOffset?:  number;
    prefix?:       string;
}

export interface Color {
    b: number;
    g: number;
    r: number;
}

export interface Content {
    text:       string;
    opacity:    number;
    fontSize:   number;
    visible:    boolean;
    color:      string;
    fontFamily: string;
    align:      string;
    wordWrap:   boolean;
}

export interface Effect {
    effectType:        string;
    name:              string;
    doubleParameters:  DoubleParameters;
    stringParameters:  StringParameters;
    booleanParameters: PlatformSpecificAssets;
}

export interface PlatformSpecificAssets {
}

export interface DoubleParameters {
    padding?:       number;
    thickness?:     number;
    distance?:      number;
    innerStrength?: number;
    outerStrength?: number;
}

export interface StringParameters {
    color: string;
}

export enum ObjectType {
    BBTextBBText = "BBText::BBText",
    PrimitiveDrawingDrawer = "PrimitiveDrawing::Drawer",
    Sprite = "Sprite",
    TextObjectText = "TextObject::Text",
}

export interface Variable {
    name:    string;
    type:    VariableType;
    value:   boolean | number;
    folded?: boolean;
}

export enum VariableType {
    Boolean = "boolean",
    Number = "number",
}

export interface ObjectsGroup {
    name:    string;
    objects: Platform[];
}

export interface Platform {
    name: string;
}

export interface Properties {
    adaptGameResolutionAtRuntime: boolean;
    folderProject:                boolean;
    orientation:                  string;
    packageName:                  string;
    pixelsRounding:               boolean;
    projectUuid:                  string;
    scaleMode:                    string;
    sizeOnStartupMode:            string;
    templateSlug:                 string;
    useExternalSourceFiles:       boolean;
    version:                      string;
    name:                         string;
    description:                  string;
    author:                       string;
    windowWidth:                  number;
    windowHeight:                 number;
    latestCompilationDirectory:   string;
    maxFPS:                       number;
    minFPS:                       number;
    verticalSync:                 boolean;
    platformSpecificAssets:       PlatformSpecificAssets;
    loadingScreen:                LoadingScreen;
    authorIds:                    any[];
    categories:                   any[];
    playableDevices:              any[];
    extensionProperties:          any[];
    platforms:                    Platform[];
    currentPlatform:              string;
}

export interface LoadingScreen {
    backgroundColor:                number;
    backgroundFadeInDuration:       number;
    backgroundImageResourceName:    string;
    gdevelopLogoStyle:              string;
    logoAndProgressFadeInDuration:  number;
    logoAndProgressLogoFadeInDelay: number;
    minDuration:                    number;
    progressBarColor:               number;
    progressBarHeight:              number;
    progressBarMaxWidth:            number;
    progressBarMinWidth:            number;
    progressBarWidthPercent:        number;
    showGDevelopSplash:             boolean;
    showProgressBar:                boolean;
}

export interface Resources {
    resources:       Resource[];
    resourceFolders: any[];
}

export interface Resource {
    alwaysLoaded: boolean;
    file:         string;
    kind:         Kind;
    metadata:     string;
    name:         string;
    smoothed:     boolean;
    userAdded:    boolean;
}

export enum Kind {
    Image = "image",
}
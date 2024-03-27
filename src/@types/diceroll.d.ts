type ChatItem = {
    person: string,
    content: string,
    diceroll?: string,
};

type CthulhuRoll = {
    person: string,
    ability: string,
    target: number,
    result: number,
    status: 'success'|'failure',
    extra?: 'critical'|'fumble'
};

type CthulhuSummary = {
    rollNum: number,
    successNum: number,
    successRate: number,
    failureNum: number,
    failureRate: number,
    criticalNum: number,
    criticalRate: number,
    fumbleNum: number,
    fumbleRate: number,
    average: number,
    standard: number,
}

type EmokloreRoll = {
    person: string,
    ability: string,
    target: number,
    dicenum: number,
    result: number[],
    success: number,
    status: 'fumble'|'failure'|'single'|'double'|'triple'|'miracle'|'catastroph'
};

type EmokloreSummary = {
    rollNum: number,
    fumbleNum: number,
    fumbleRate: number,
    failureNum: number,
    failureRate: number,
    singleNum: number,
    singleRate: number,
    doubleNum: number,
    doubleRate: number,
    tripleNum: number,
    tripleRate: number,
    miracleNum: number,
    miracleRate: number,
    catastrophNum: number,
    catastrophRate: number,
    hitNum: number,
    hitRate: number,
    errorNum: number,
    errorRate: number,
    successAverage: number,
};
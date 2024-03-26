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
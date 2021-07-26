export const isValidDate = (date: number, createAt: number): boolean => {
    const _date = new Date(date);
    const _createAt= new Date(createAt);
    if (Object.prototype.toString.call(_date) === 'Invalid Date') {
        return false;
    }
    return (_date.setMinutes(_date.getMinutes()+10)) >= _createAt.setDate(_createAt.getDate() + 7);
};

export const formatDate = (date:number) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}

export const serializeTimestampsFor=(timestamp:number,isTargetSolidity:boolean):number=>{
    return isTargetSolidity?  Math.floor(timestamp/1000):timestamp*1000;
}


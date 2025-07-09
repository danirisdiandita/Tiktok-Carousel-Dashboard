export const getHumanReadableDate = (date: Date | undefined): string => {
    console.log('datae', date)
    if (!date) return "";
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let dayString: string;
    switch (day % 10) {
        case 1:
            dayString = `${day}st`;
            break;
        case 2:
            dayString = `${day}nd`;
            break;
        default:
            dayString = `${day}th`;
    }
    return `${month} ${dayString}, ${year}`;
}
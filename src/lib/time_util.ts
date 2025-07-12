export const getHumanReadableDate = (date: Date | undefined): string => {
    if (!date) return "";
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let dayString: string;
    const hhmm = date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');

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
    return `${hhmm}, ${month} ${dayString}, ${year}`;
}
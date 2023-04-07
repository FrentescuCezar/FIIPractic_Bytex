export function extractNameFromEmail(email: string | undefined | null): string {
    const atIndex = email?.indexOf('@');
    if (atIndex !== undefined && atIndex >= 0) {
        return email!.slice(0, atIndex);
    } else {
        return email || '';
    }
}

export function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    } else {
        return text;
    }
}

export function formatTextWithNewlines(text: string) {
    return text.split('\n').map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
}

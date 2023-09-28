export const delay = (seconds: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
};

export const generateAccountNumber = (): string => {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return randomNumber.toString().padStart(9, '0');
};

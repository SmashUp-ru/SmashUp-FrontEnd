import { useEffect, useState } from 'react';

function encode(
    file: File,
    setProgress?: (processed: number, total: number) => unknown,
    setResult?: (result: string) => unknown
): FileReader {
    const reader = new FileReader();

    if (setProgress) {
        reader.onprogress = (event) => {
            setProgress(event.loaded, event.total);
        };
    }

    if (setResult) {
        reader.onload = async () => {
            const prefix = 'base64,';

            let result = reader.result as string;

            const index = result.indexOf(prefix);
            if (index > -1) {
                result = result.substring(index + prefix.length);
            }

            setResult(result);
        };
    }

    reader.readAsDataURL(file);

    return reader;
}

export function useBase64(
    file: File | null,
    setProgress?: (processed: number, total: number) => unknown,
    setResult?: (result: string | null) => unknown
) {
    const [reader, setReader] = useState<FileReader>();

    useEffect(() => {
        reader?.abort();

        if (file) {
            if (setProgress) {
                setProgress(0, file.size);
            }

            if (setResult) {
                setResult(null);
            }

            setReader(encode(file, setProgress, setResult));
        }
    }, [file]);
}

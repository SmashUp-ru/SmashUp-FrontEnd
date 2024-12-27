import { useEffect, useState } from 'react';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = [];
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < bytes.byteLength; i++) {
        binary.push(String.fromCharCode(bytes[i]));
    }

    return btoa(binary.join(''));
}

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
        reader.onload = () => setResult(arrayBufferToBase64(reader.result as ArrayBuffer));
    }

    reader.readAsArrayBuffer(file);

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

import InputBackground from '@/components/common/InputBackground';
import { HeroLite } from '@/models/hero-lite';
import { Hero } from 'forgesteel';
import { ChangeEvent, useRef } from 'react';

interface UploadCharacterProps {
    onUpload: (character: Hero | HeroLite) => void;
}

export function UploadCharacter({ onUpload }: UploadCharacterProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDivClick = () => {
        inputRef.current!.value = '';
        inputRef.current!.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            if (files.length != 1) return;
            const file = files[0];
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                const content = e.target?.result as string;
                const hero = new Hero(JSON.parse(content) as Hero);
                onUpload(hero);
            };

            reader.readAsText(file);
        }
    };
    
    return (
        <div className="p-2 flex-shrink">
            <InputBackground color="BLUE" className="rounded-full items-center">
                <div onClick={() => handleDivClick()} className="w-full cursor-pointer p-1 flex items-center justify-center text-sm hover:bg-sky-500 transition-colors text-white">
                    Upload Character
                </div>
            </InputBackground>
            <input
                type="file"
                ref={inputRef}
                accept=".json,.ds-hero"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}
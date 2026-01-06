import InputBackground from '@/components/common/InputBackground';
import { Hero } from 'forgesteel';
import { useMemo } from 'react';

interface SkillsProps {
    hero: Hero;
}

export function Skills({ hero }: SkillsProps) {
    const skills = useMemo(() => hero.getSkills(), [hero]);
    return (
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
            <div className="bg-indigo-900 text-white p-2">
                <h2 className="text-sm font-bold">Skills</h2>
            </div>
            <div className="columns-1 md:columns-3 gap-2 p-2">
                {skills.map((skill) => (
                    <div key={skill.name} className="break-inside-avoid mb-1 flex flex-shrink">
                        <InputBackground color={'DEFAULT'}>
                            <div className="p-1.5 text-sm text-gray-900">{skill.name}</div>
                        </InputBackground>
                    </div>
                ))}
            </div>
        </div>
    );
}

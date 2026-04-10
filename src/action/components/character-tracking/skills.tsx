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
                        <div className="bg-indigo-100 border border-indigo-200 rounded flex items-center justify-center">
                            <div className="p-1.5 text-sm font-bold text-gray-500">
                                {skill.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

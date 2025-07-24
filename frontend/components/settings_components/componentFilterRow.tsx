import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useEffect, useState } from "react";

type ComponentFilterType = {
    category: string;
    items: string[];
    position: number;
    updateContentPosition: (index: number, moveBy: number) => void;
    updateArrayContent: (index: number, newArray: string[]) => void;
}


export default function ComponentFilterRow({ category, items, position, updateArrayContent, updateContentPosition }: ComponentFilterType) {
    const [tags, setTags] = useState<string[]>([]);
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const convertedInput = input.trim().toLowerCase()
            if (!tags.includes(convertedInput)) {
                const newTags: string[] = [...tags, convertedInput]
                updateArrayContent(position, newTags)
            }
            setInput('')
        }
    }

    const removeTag = (index: number) => {
        const newTags: string[] = tags.filter((_, i) => i !== index)
        updateArrayContent(position, newTags)
    }

    useEffect(() => {
        setTags(items)
    }, [items])

    return (
        <div className="flex flex-col w-full">
            <div>
                <div className="text-xl border-b border-b-gray-300 mb-2">{category}</div>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-wrap gap-2 mb-2 h-fit">
                        {tags.map((tag, i) => (
                            <div
                                key={i}
                                className="flex items-center text-nowrap bg-green-100 text-green-800 pl-3 py-0.5 rounded-lg text-xs"
                            >
                                {tag}
                                <X onClick={() => removeTag(i)}
                                    className="ml-0.5 mr-1 w-3/4 h-3/4 text-green-700 hover:text-red-500 hover:cursor-pointer" />
                            </div>
                        ))}
                    </div>
                    <div className="h-full">
                        <ChevronUp className="hover:cursor-pointer" onClick={() => updateContentPosition(position, -1)} />
                        <ChevronDown className="hover:cursor-pointer" onClick={() => updateContentPosition(position, 1)} />
                    </div>
                </div>


            </div>

            <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Type and press Enter to add new filter tag"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}
import ComponentFilterRow from "@/context/componentFilterRow"
import { useDatabase } from "@/context/DatabaseContext"
import { useProfile } from "@/context/ProfileContext"
import { useEffect, useState } from "react"

export default function CustomFilter() {
    const { keywordMap } = useProfile()
    const [categoryArray, setCategoryArray] = useState<[string, string[]][]>([])
    const { transactions } = useDatabase()

    useEffect(() => {
        const catArray = [...keywordMap.entries()]
        const uniqueCategory = new Set(transactions.map(each => each.category))
        uniqueCategory.forEach(cat => {
            if (cat == 'Others') return
            if (!keywordMap.has(cat)) {
                catArray.push([cat, []])
            }
        })
        setCategoryArray(catArray)
    }, [])

    return (
        <div>
            {categoryArray.map(([category, items], index) =>
                <div key={category} className="flex flex-col">
                    <ComponentFilterRow category={category} items={items} position={index}/>
                </div>)}
        </div>
    )
}
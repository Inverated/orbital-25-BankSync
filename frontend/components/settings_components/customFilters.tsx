import ComponentFilterRow from "@/components/settings_components/componentFilterRow"
import { useDatabase } from "@/context/DatabaseContext"
import { useProfile } from "@/context/ProfileContext"
import { useUserId } from "@/context/UserContext"
import { addProfileDetails } from "@/lib/supabaseUpload"
import { defaultKeywordMap, Profile } from "@/utils/types"
import { useEffect, useState } from "react"

export default function CustomFilter() {
    const { keywordMap, refreshProfile, refreshStatus } = useProfile()
    const [categoryArray, setCategoryArray] = useState<[string, string[]][]>([])
    const { transactions } = useDatabase()
    const userId = useUserId()

    const updateContentPosition = (index: number, moveBy: number) => {
        const newPos = index + moveBy
        if (newPos >= categoryArray.length || newPos < 0) {
            return
        }
        const newCatArray = [...categoryArray]
        const temp = newCatArray[index]
        newCatArray[index] = newCatArray[newPos]
        newCatArray[newPos] = temp
        setCategoryArray(newCatArray)
    }

    const updateArrayContent = (index: number, newArray: string[]) => {
        const newCatArray = [...categoryArray]
        newCatArray[index][1] = newArray
        setCategoryArray(newCatArray)
    }

    const resetFilter = async () => {
        const profile: Profile = {
            user_id: userId,
            category_filter: defaultKeywordMap
        }
        await addProfileDetails(userId, profile)
        await refreshProfile()
    }

    const setNewCategoryArray = async () => {
        const profile: Profile = {
            user_id: userId,
            category_filter: Object.fromEntries(categoryArray)
        }
        await addProfileDetails(userId, profile)
        await refreshProfile()
    }

    const initialiseCategoryArray = () => {
        const catArray = [...keywordMap.entries()]
        const uniqueCategory = new Set(transactions.map(each => each.category))
        uniqueCategory.forEach(cat => {
            if (cat == 'Others') return
            if (!keywordMap.has(cat)) {
                catArray.push([cat, []])
            }
        })
        setCategoryArray(catArray)
    }

    useEffect(() => {
        initialiseCategoryArray()
    }, [refreshStatus])

    return (
        <div className="pt-5 w-full">
            <div className="px-5 text-2xl">Custom Filter Condition</div>
            <div className="px-5 py-5">
                <div>
                    Filter priority top to bottom. Will match entire word, not partial
                    <div className="text-sm">
                        <p>Example: Matching &quot;to&quot;:
                            From A <span className="text-green-400 italic">to</span> B;
                            Cus<span className="text-red-400 italic">to</span>m</p>
                    </div>

                </div>
            </div>
            {categoryArray.map(([category, items], index) =>
                <div key={category} className="flex flex-col my-4 px-8 py-1">
                    <ComponentFilterRow
                        category={category}
                        items={items}
                        position={index}
                        updateArrayContent={updateArrayContent}
                        updateContentPosition={updateContentPosition} />
                </div>)
            }
            <div className="flex sm:flex-row not-sm:flex-col not-sm:space-y-2 items-center bottom-0 sticky w-full border-t justify-between px-4 py-2 bg-white z-50">
                <button className="h-fit border rounded-lg px-3 py-2 hover:bg-gray-300 hover:cursor-pointer active:scale-95"
                    onClick={resetFilter}>
                    Reset Filters
                </button>
                <div className="overflow-visible space-x-3 not-sm:flex-col">
                    <button className="h-fit border rounded-lg px-3 py-2 hover:bg-gray-300 hover:cursor-pointer active:scale-95"
                        onClick={initialiseCategoryArray}>
                        Cancel
                    </button>
                    <button className="h-fit border rounded-lg px-3 py-2 hover:bg-gray-300 hover:cursor-pointer active:scale-95"
                        onClick={setNewCategoryArray}>
                        Confirm
                    </button>
                </div>
            </div>

        </div>
    )
}
'use client';

import { useFilterParams } from "@/lib/hooks/useFilterParams";
import { UserFilters } from "@/lib/types";
import { Button, Label, ListBox, Select, Slider, Spinner, Switch } from "@heroui/react";
import { useEffect } from "react";
import { FaFemale, FaMale } from "react-icons/fa";

const defaultFilters: UserFilters = {
    ageRange: [18,100],
    gender: ['male', 'female'],
    orderBy: 'updated',
    withPhoto: true
}

type Props = {
    totalCount: number;
}

export default function Filters({totalCount}: Props) {
    const {searchParams, commit, isPending, restore} = useFilterParams();

    useEffect(() => {
        if (!searchParams.toString()) restore();
    }, [restore, searchParams]);

    const ageRangeParams = searchParams.get('ageRange');
    const genderParam = searchParams.get('gender');
    const withPhoto = searchParams.get('withPhoto');

    const filters: UserFilters = {
        ageRange: ageRangeParams ? ageRangeParams.split(',').map(Number) : defaultFilters.ageRange,
        gender: genderParam !== null ? (genderParam ? genderParam.split(',') : []) 
            : defaultFilters.gender,
        orderBy: searchParams.get('orderBy') ?? defaultFilters.orderBy,
        withPhoto: Boolean(withPhoto)
    }

    const orderByList = [
        { label: 'Order by: Last active', value: 'updated' },
        { label: 'Order by: Newest members', value: 'created' },
    ];

    const genderList = [
        { value: 'male', icon: FaMale },
        { value: 'female', icon: FaFemale },
    ];

    const handleAgeSelect = (value: number[]) => {
        commit({ageRange: value.join(','), page: null})
    }

    const handleOrderBy = (value: string) => {
        commit({orderBy: value, page: null})
    }

    const handleGenderToggle = (value: string) => {
        const next = filters.gender.includes(value)
            ? filters.gender.filter(g => g !== value)
            : [...filters.gender, value];

        commit({gender: next.join(','), page: null});
    }

    const handleWithPhoto = (selected: boolean) => {
        commit({withPhoto: String(selected), page: null})
    }

    return (
        <div className="shadow-md mt-16 w-screen bg-white py-3 px-6 z-40 mx-[calc(50%-50vw)]">
            <div className="flex flex-row justify-around items-center">
                <div className="text-accent font-semibold text-xl flex gap-3 items-center">
                    <span>Results:</span>
                    {isPending ? <Spinner /> : totalCount}
                </div>
                <div className="flex gap-2 items-center">
                    <div>Gender:</div>
                    {genderList.map(({ icon: Icon, value }) => (
                        <Button 
                            key={value} 
                            size="sm"
                            onClick={() => handleGenderToggle(value)}
                            variant={filters.gender.includes(value) ? 'primary' : 'secondary'}
                        >
                            <Icon size={24} />
                        </Button>
                    ))}
                </div>
                <div className="flex flex-col gap-2 w-1/4">
                    <Slider
                        key={filters.ageRange.join('-')}
                        className='w-full'
                        defaultValue={filters.ageRange}
                        maxValue={100}
                        minValue={18}
                        step={1}
                        onChangeEnd={value => handleAgeSelect(value as number[])}
                    >
                        <Label>Age range</Label>
                        <Slider.Output />
                        <Slider.Track>
                            {({ state }) => (
                                <>
                                    <Slider.Fill />
                                    {state.values.map((_, i) => (
                                        <Slider.Thumb key={i} index={i} />
                                    ))}
                                </>
                            )}
                        </Slider.Track>
                    </Slider>
                </div>

                <Switch defaultSelected onChange={selected => handleWithPhoto(selected)}>
                    <Switch.Control>
                        <Switch.Thumb />
                    </Switch.Control>
                    <Switch.Content>
                        With photo
                    </Switch.Content>
                </Switch>
                
                <div className="w-1/4">
                    <Select 
                        defaultValue={filters.orderBy}
                        placeholder="Select order" 
                        aria-label="order by"
                        key={filters.orderBy}
                        onChange={key => handleOrderBy(key as string)}
                    >
                        <Select.Trigger className="w-full">
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {orderByList.map(item => (
                                    <ListBox.Item key={item.value} id={item.value} textValue={item.value}>
                                        {item.label}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>
            </div>

        </div>
    )
}
import TextInput from "@/components/TextInput"
import { ProfileSchema } from "@/lib/schemas/registerSchema"
import { Button, Label, Radio, RadioGroup } from "@heroui/react"
import clsx from "clsx"
import { format, subYears } from "date-fns"
import { useState } from "react"
import { Control, Controller, UseFormSetValue } from "react-hook-form"
import { FaMale, FaFemale, FaLocationArrow } from "react-icons/fa"

type Props = {
    control: Control<ProfileSchema>;
    setValue: UseFormSetValue<ProfileSchema>
}

export default function ProfileForm({ control, setValue }: Props) {
    const [locating, setLocating] = useState(false);
    const genderList = [
        { value: 'male', label: 'Male', icon: FaMale },
        { value: 'female', label: 'Female', icon: FaFemale },
    ];

    const detectLocation = () => {
        if (!navigator.geolocation) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const res = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
                    );
                    const data = await res.json();
                    const city = data.city || data.locality || data.principalSubdivision || '';
                    setValue('city', city, { shouldValidate: true });
                    setValue('country', data.countryCode ?? '', { shouldValidate: true })
                } finally {
                    setLocating(false);
                }
            },
            () => setLocating(false),
            { enableHighAccuracy: false, timeout: 10000 }
        )
    }

    return (
        <div>
            <Controller
                name='gender'
                control={control}
                render={({ field, fieldState }) => (
                    <RadioGroup variant="secondary" onChange={field.onChange} className='pb-3'>
                        <Label>Gender</Label>
                        <div className="grid grid-cols-2 gap-x-4">
                            {genderList.map(({ value, icon: Icon, label }) => (
                                <Radio key={value} value={value} className='group mt-0'>
                                    <Radio.Content
                                        className={clsx(
                                            "relative flex flex-row w-full items-center gap-4 rounded-xl border border-gray-400 px-5 py-4",
                                            "group-data-[selected=true]:border-accent group-data-[selected=true]:bg-accent/10"
                                        )}
                                    >
                                        <Icon size={24} />
                                        <div>{label}</div>
                                    </Radio.Content>
                                </Radio>
                            ))}
                        </div>
                        {fieldState.error && (
                            <span className="text-danger text-sm">{fieldState.error?.message}</span>
                        )}
                    </RadioGroup>
                )}
            />
            <TextInput
                control={control}
                name="dateOfBirth"
                label="Date of birth"
                type="date"
                max={format(subYears(new Date(), 18), 'yyyy-MM-dd')}
            />
            <TextInput
                control={control}
                name="description"
                label="Tell us about yourself"
                multiline
            />
            <div className="relative">
                <Button
                    type="button"
                    variant="secondary"
                    onPress={detectLocation}
                    isPending={locating}
                    size="sm"
                    className='absolute right-0 -top-1'
                >
                    <FaLocationArrow />
                    {locating ? 'Locating...' : 'Use my location'}
                </Button>
                <TextInput control={control} name="city" label="City" />
                <TextInput control={control} name="country" label="Country" />
            </div>

        </div>
    )
}
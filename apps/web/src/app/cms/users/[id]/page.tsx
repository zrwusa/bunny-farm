import {BellRing, Check} from 'lucide-react'

import {cn} from '@/utils'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card'
import {Switch} from '@/components/ui/switch'


type CardProps = { params: Promise<{ id: string }> }

const User = async ({params}: CardProps) => {
    const id = (await params).id

    return (
        <Card className={cn('w-[380px]')}>
            {id}
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <BellRing/>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Push Notifications
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Send notifications to device.
                        </p>
                    </div>
                    <Switch/>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    <Check/> Mark all as read
                </Button>
            </CardFooter>
        </Card>

    );
};

export default User;

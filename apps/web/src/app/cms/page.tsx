import {BarChartCard} from '@/components/features/cms/bar-chart-card';
import {AreaChartCard} from '@/components/features/cms/area-chart-card';
import {RadarChartCard} from '@/components/features/cms/radar-chart-card';
import {LineChartCard} from '@/components/features/cms/line-chart-card';

const CMSHome = () => {
    return (
        <>
            <AreaChartCard/>
            <div className="grid grid-cols-2 gap-4">

                <LineChartCard/>
                <BarChartCard/>
                <RadarChartCard/>
            </div>
        </>
    );
};

export default CMSHome;

import {BarChartCard} from '@/app/cms/_components/bar-chart-card';
import {AreaChartCard} from '@/app/cms/_components/area-chart-card';
import {RadarChartCard} from '@/app/cms/_components/radar-chart-card';
import {LineChartCard} from '@/app/cms/_components/line-chart-card';

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

import { ReactComponent as gear } from './gear.svg'
import { ReactComponent as question } from './question.svg'
import { ReactComponent as newProject } from './new-project.svg'
import { ReactComponent as project } from './project.svg'
import { ReactComponent as chart } from './chart.svg'
import { ReactComponent as back } from './back.svg'
import { ReactComponent as logout } from './logout.svg'
import { ReactComponent as wind } from './wind.svg'
import { ReactComponent as key } from './key.svg'
import { ReactComponent as user } from './user.svg'

const wrapper = (Element: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
}>, viewBox: string) => (props: React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
}) => <Element viewBox={viewBox} {...props} />

export const svg = {
    gear: wrapper(gear, '0 0 24 24'),
    question: wrapper(question, '0 0 24 24'),
    newProject: wrapper(newProject, '0 0 24 24'),
    project: wrapper(project, '0 0 24 24'),
    chart: wrapper(chart, '0 0 24 24'),
    back: wrapper(back, '0 0 24 24'),
    logout: wrapper(logout, '0 0 24 24'),
    wind: wrapper(wind, '0 0 24 24'),
    key: wrapper(key, '0 0 24 24'),
    user: wrapper(user, '0 0 24 24'),
}

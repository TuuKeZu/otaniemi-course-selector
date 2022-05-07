document.addEventListener('DOMContentLoaded', () => {
    Initialize();
});

const Initialize = async () => {
    console.log('ready!');

    const fetchCourses = async () => {
        return new Promise(async (resolve, reject) => {
            const res = await fetch('wilma.json');
            const data = await res.json();

            return resolve(data);
        });
    }

    const getSelectedCourses = () => {
        let courses = localStorage.getItem('selected-courses');

        if (courses == null) {
            localStorage.setItem('selected-courses', JSON.stringify([]));
            return [];
        }

        return JSON.parse(courses);
    }

    const setSelectedCourse = (course = String) => {
        let courses = getSelectedCourses();

        courses.push(course.toString());
        localStorage.setItem('selected-courses', JSON.stringify(courses));

        return courses;
    }

    const removeSelectedCourse = (course = String) => {
        let courses = getSelectedCourses();

        courses.splice(courses.indexOf(course), 1);
        localStorage.setItem('selected-courses', JSON.stringify(courses));

        return courses;
    }


    const state = {
        data: await fetchCourses(),
        periods: {},
        periodList: [
            '1A',
            '1B',
            '2A',
            '2B',
            '3A',
            '3B',
            '4A',
            '4B',
            '5A',
            '5B'
        ],
        selected: getSelectedCourses()
    }

    console.log(state.selected);

    const CONTAINER = document.getElementById('container');

    const Render = () => {
        state.periods = [];
        CONTAINER.replaceChildren([]);

        state.data.periodit.forEach(period => {

            if (state.periods[period.periodi] == null) {
                const periodElement = document.createElement('div');
                periodElement.className = "period";
                periodElement.id = period.periodi;

                const titleElement = document.createElement('h3');
                titleElement.textContent = `${period.periodi}. Periodi (Otaniemen lukio 2022 - 2023)`;

                periodElement.appendChild(titleElement);

                state.periods[period.periodi] = periodElement;
            }

            const periodElement = state.periods[period.periodi];
            const barElement = document.createElement('div');
            barElement.className = 'bar';

            period.kurssit.forEach(course => {
                const courseElement = document.createElement('div');
                courseElement.id = state.selected.includes(course.nimi) ? 'course-selected' : 'course';
                courseElement.className = course.class;
                courseElement.textContent = course.nimi;

                barElement.appendChild(courseElement);
            });

            periodElement.appendChild(barElement);
        });

        state.periodList.forEach(key => {
            CONTAINER.appendChild(state.periods[key]);
        })
    }


    Render();

    document.addEventListener('click', (e) => {
        const allowed = ['course', 'course-selected']
        if (!allowed.includes(e.target.id)) return;
        const course = e.target.textContent;

        if (state.selected.includes(course)) {
            state.selected = removeSelectedCourse(course);
        }
        else {
            state.selected = setSelectedCourse(course);
        }

        Render();
    })

}
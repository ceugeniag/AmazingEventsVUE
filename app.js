const {createApp} = Vue

const app = createApp ({
    data(){
        return{
            events: [],
            categories: [],
            currentDate: [],
            checked: [],
            valorBusqueda: "",
            eventsFiltrados: [],
            valorCheckbox:[],
            filtroCheckbox:[],
            eventDetail:[],
            futureEvents:[],
            eventsFutureFiltrados:[],
            pastEvents:[],
            eventsPastFiltrados:[],
            pastEventsOrdenados:[],
            catUpcoming: [],
            catUpcomingSet:[],
            arrayCatUpcoming: [],
            categoryUpcomingData: [],
            categoryPastData:[],
            category:[],
            catPast:[],
            categoryPast:[],
            arrayCatPast:[],
                }
    },
    created(){
        fetch(" https://mindhub-xj03.onrender.com/api/amazing")
        .then(response =>response.json())
        .then((datos) => {
            console.log(datos);
            this.events = datos.events
            console.log(this.events)
            this.categories= Array.from(new Set(this.events.map(category => category.category)))
            console.log(this.categories)
            const params = new URLSearchParams(location.search)
            const id = params.get("id")
            this.eventDetail = datos.events.find(event => event._id == id);
            console.log(this.eventDetail)
            this.futureEvents= this.events.filter(event => event.date > datos.currentDate)
            console.log(this.futureEvents)
            this.pastEvents= this.events.filter(event => event.date < datos.currentDate)
            console.log(this.pastEvents)

            //ACA EMPIEZO CON LA TABLA 
            this.pastEvents.map(e => {
                let assistance = e.assistance;
                let capacity = e.capacity;
                let porcentaje = ((assistance / capacity) * 100).toFixed();
                e.porcentaje = porcentaje;
            });
            this.pastEventsOrdenados = this.pastEvents.sort((a, b) => b.porcentaje - a.porcentaje);
            this.capacity = this.events.filter(event => event.capacity).sort((a, b) => b.capacity - a.capacity);
            console.log(this.pastEventsOrdenados);

            // TABLA UPCOMING 
            this.catUpcoming = this.futureEvents.map(events => events.category);
            console.log(this.catUpcoming)
            this.catUpcomingSet = new Set(this.catUpcoming);
            this.categoryUpc = [...this.catUpcomingSet];
            console.log(this.categoryUpc);
    
            this.categoryUpc.map(category =>
                this.arrayCatUpcoming.push({
                    category: category,
                event: this.futureEvents.filter(event => event.category === category),
            }));
            console.log(this.arrayCatUpcoming);
        

            this.arrayCatUpcoming.map(datos => {
                this.categoryUpcomingData.push({
                    category: datos.category,
                    estimate: datos.event.map(event => event.estimate),
                    capacity: datos.event.map(event => event.capacity),
                    estimateRevenue: datos.event.map(event => event.estimate * event.price),
                });
            })
            console.log(this.categoryUpcomingData);


            this.categoryUpcomingData.forEach(categories => {
                let totalEstimate = 0;
                categories.estimate.forEach(estimate => totalEstimate += Number(estimate));
                categories.estimate = totalEstimate;
        
                let totalCapacityUpc = 0;
                categories.capacity.forEach(capacity => totalCapacityUpc += Number(capacity));
                categories.capacity = totalCapacityUpc;
        
                let totalEstimateRevenue = 0;
                categories.estimateRevenue.forEach(estimateRevenue => totalEstimateRevenue += Number(estimateRevenue))
                categories.estimateRevenue = totalEstimateRevenue;
        
                categories.porcentajeAttendace = ((totalEstimate * 100) / totalCapacityUpc).toFixed();
            })
            console.log(this.categoryUpcomingData);

            //TABLA PAST
            this.catPast = this.pastEvents.map(eventos => eventos.category)
            this.catPastSet = new Set(this.catPast)
            this.categoryPast = [...this.catPastSet]
            console.log(this.categoryPast)
        

            this.categoryPast.map(category =>
                this.arrayCatPast.push({
                    category: category,
                    evento: this.pastEvents.filter(evento => evento.category === category),
                }))
            console.log(this.arrayCatPast)
        

            this.arrayCatPast.map(datos => {
                this.categoryPastData.push({
                    category: datos.category,
                    assistance: datos.evento.map(item => item.assistance),
                    capacity: datos.evento.map(item => item.capacity),
                    revenue: datos.evento.map(item => item.assistance * item.price)
                })
            })
            console.log(this.categoryPastData)
        
            this.categoryPastData.forEach(category => {
                let totalAssistance = 0
                category.assistance.forEach(assistance => totalAssistance += Number(assistance))
                category.assistance = totalAssistance
        
                let totalCapacityPast = 0
                category.capacity.forEach(capacity => totalCapacityPast += Number(capacity))
                category.capacity = totalCapacityPast
        
                let totalRevenue = 0
                category.revenue.forEach(revenue => totalRevenue += Number(revenue))
                category.revenue = totalRevenue
        
                category.attendancePerc = ((totalAssistance * 100) / totalCapacityPast).toFixed()
            })
            console.log(this.categoryPastData)



        })
        .catch(error => console.log(error))
    },
    computed: {
        filtro(){
            let filtroBusqueda = this.events.filter(event => event.name.toLowerCase().includes(this.valorBusqueda.toLowerCase()))
            let filtroCheckbox = filtroBusqueda.filter(event => this.checked.includes(event.category) || this.checked.length == 0)
            this.eventsFiltrados = filtroCheckbox
        },
        filtroUpComing(){
            let filtroBusquedaFuturo = this.futureEvents.filter(event => event.name.toLowerCase().includes(this.valorBusqueda.toLowerCase()))
            let filtroCheckboxfuturo = filtroBusquedaFuturo.filter(event => this.checked.includes(event.category) || this.checked.length == 0)
            this.eventsFutureFiltrados = filtroCheckboxfuturo
        },
        filtroPast(){
            let filtroBusquedaPast = this.pastEvents.filter(event => event.name.toLowerCase().includes(this.valorBusqueda.toLowerCase()))
            let filtroCheckboxPast = filtroBusquedaPast.filter(event => this.checked.includes(event.category) || this.checked.length == 0)
            this.eventsPastFiltrados = filtroCheckboxPast
        },
    }
})
app.mount("#app")


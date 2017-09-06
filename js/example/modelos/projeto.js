var entities = 
[
	{ name: "menu" },
	{ name: "exemplo" },
	{ name: "video" }
];

var intents = 
[
	{
		name: "projeto",
		action: "RequestFocus",
		phrases: 
	    {
	        "pt-BR": 
	        [
	            { 
	            	phrase: "Projeto", 
	            	entities:[{ type: "menu", value: "Projeto", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Informações",
	            	entities:[{ type: "menu", value: "Informações", principal: "Projeto", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Informações sobre o projeto",
	            	entities:[{ type: "menu", value: "Informações sobre o projeto", principal: "Projeto", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Detalhes do projeto",
	            	entities:[{ type: "menu", value: "Detalhes do projeto", principal: "Projeto", alias:"menu" }] 
	            }
	        ],
	        "en-US": 
	        [
	        	{ 
	            	phrase: "Project", 
	            	entities:[{ type: "menu", value: "Project", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Informações",
	            	entities:[{ type: "menu", value: "Informations of project", principal: "Project", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Details of project",
	            	entities:[{ type: "menu", value: "Details of project", principal: "Project", alias:"menu" }] 
	            }
	        ]
	    },
	    params: [ {name: "container", value: "projeto" } ]
	},
	{
		name: "desenvolvedor",
		action: "RequestFocus",
		phrases: 
	    {
	        "pt-BR": 
	        [
	        	{ 
	            	phrase: "Desenvolvedor", 
	            	entities:[{ type: "menu", value: "Desenvolvedor", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Quem fez",
	            	entities:[{ type: "menu", value: "Quem fez", principal: "Desenvolvedor", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Feito por quem",
	            	entities:[{ type: "menu", value: "Feito por quem", principal: "Desenvolvedor", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Autor",
	            	entities:[{ type: "menu", value: "Autor", principal: "Desenvolvedor", alias:"menu" }] 
	            }
	        ],
	        "en-US": 
	        [
	        	{ 
	            	phrase: "Developer", 
	            	entities:[{ type: "menu", value: "Developer", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Who did",
	            	entities:[{ type: "menu", value: "Quem fez", principal: "Developer", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Author",
	            	entities:[{ type: "menu", value: "Author", principal: "Developer", alias:"menu" }] 
	            }
	        ]
	    },
	    params: [ {name: "container", value: "desenvolvedor-biografia" } ]
	},
	{
		name: "colaboradores",
		action: "RequestFocus",
		phrases: 
	    {
	        "pt-BR": 
	        [
	        	{ 
	            	phrase: "Colaboradores", 
	            	entities:[{ type: "menu", value: "Colaboradores", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Membros",
	            	entities:[{ type: "menu", value: "Membros", principal: "Colaboradores", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Ajudantes",
	            	entities:[{ type: "menu", value: "Ajudantes", principal: "Colaboradores", alias:"menu" }] 
	            }
	        ],
	        "en-US": 
	        [
		        { 
	            	phrase: "Members", 
	            	entities:[{ type: "menu", value: "Members", alias:"menu" }] 
	            }, 
	            { 
	            	phrase: "Contributors",
	            	entities:[{ type: "menu", value: "Contributors", principal: "Members", alias:"menu" }] 
	            }
	        ]
	    },
	    params: [ {name: "container", value: "colaboradores" } ]
	},
	{
		name: "exemplos",
		action: "ListarExemplos",
		phrases: 
	    {
	        "pt-BR": 
	        [
	        	{ phrase: "Exemplos" }, 
	        	{ phrase: "Demonstrações" },
	        	{ phrase: "Implementações" },
	        	{ phrase: "Me mostre os exemplos" }
	        ],
	        "en-US": 
	        [
		        { phrase: "Examples" }, 
	        	{ phrase: "Demos" },
	        	{ phrase: "Implementations" },
	        	{ phrase: "Show me the examples" },
	        ]
	    }
	},
	{
		name: "exemplo",
		action: "AcessarExemplo",
		phrases: 
	    {
	        "pt-BR": 
	        [
	        	{ 
	            	phrase: "Fast Food", 
	            	entities:[{ type: "exemplo", value: "Fast Food", alias:"exemplo" }] 
	            }, 
	            { 
	            	phrase: "Reserva de hotéis",
	            	entities:[{ type: "exemplo", value: "Reserva de hotéis", alias:"exemplo" }] 
	            }, 
	            { 
	            	phrase: "Hotéis",
	            	entities:[{ type: "exemplo", value: "Hotéis", principal: "Reserva de Hotéis", alias:"exemplo" }] 
	            }
	        ],
	        "en-US": 
	        [
		        { 
	            	phrase: "Fast Food", 
	            	entities:[{ type: "exemplo", value: "Fast Food", alias:"exemplo" }] 
	            }, 
	            { 
	            	phrase: "Reservation of hotels",
	            	entities:[{ type: "exemplo", value: "Reservation of hotels", alias:"exemplo" }] 
	            }, 
	            { 
	            	phrase: "Hotels",
	            	entities:[{ type: "exemplo", value: "Hotels", principal: "Reservation of hotels", alias:"exemplo" }] 
	            }
	        ]
	    },
	    params: [ {name: "exemplo", value: "$exemplo" } ]
	},

	{
		name: "videos",
		action: "ListarVideos",
		phrases: 
	    {
	        "pt-BR": 
	        [
	        	{ 
	            	phrase: "Vídeos", 
	            	entities:[{ type: "video", value: "Vídeos", alias:"video" }] 
	            }, 
	            { 
	            	phrase: "Demonstrações",
	            	entities:[{ type: "video", value: "Demonstrações", principal: "Vídeos", alias:"video" }] 
	            }
	        ],
	        "en-US": 
	        [
	        	{ 
	            	phrase: "Videos", 
	            	entities:[{ type: "video", value: "Videos", alias:"video" }] 
	            }, 
	            { 
	            	phrase: "Demos",
	            	entities:[{ type: "video", value: "Demos", principal: "Videos", alias:"video" }] 
	            }
	        ]
	    }
	},

	{
		name: "video",
		action: "AcessarVideo",
		phrases: 
	    {
	        "pt-BR": 
	        [
	        	{ 
	            	phrase: "Reservando Hotel", 
	            	entities:[{ type: "video", value: "Reservando Hotel", alias:"video" }] 
	            },

	            { 
	            	phrase: "Demonstração de Reserva de Hotel", 
	            	entities:[{ type: "video", value: "Demonstração de Reserva de Hotel", principal:"Reservando Hotel", alias:"video" }]
	            },
	        ],
	        "en-US": 
	        [
		        { 
	            	phrase: "Booking hotel", 
	            	entities:[{ type: "video", value: "Booking hotel", alias:"video" }] 
	            }, 
	            { 
	            	phrase: "Hotel booking demonstration",
	            	entities:[{ type: "video", value: "Hotel booking demonstration", alias:"video" }] 
	            }
	        ]
	    },
	    params: [ {name: "video", value: "$video" } ]
	},
];

var interfaces = 
[
	{
		name: "landing",
		title: { "pt-BR": "Projeto de Mestrado", "en-US": "Master's Project" },
		widgets: 
		[
			{
	            name: "mainNav",
	            children:
	            [
	                {
	                    name: "menu",
	                    datasource: "valores.menu",
	                    entity: { name: "menu", key: "item" },
	                    children: [
	                        {
	                            name: "menu-item",
	                            title: "$data.item"
	                        }
	                    ]
	                }
	            ]
	        },
	        {
	            name: "projeto", children:
	            [
	                { name: "descricao-projeto", bind: "valores.projeto", tts: "$bind"}
	            ]
	        },
	        {
	            name: "desenvolvedor",
	            children: [
	                {
	                    name: "desenvolvedor-imagem",
	                    bind: "valores.desenvolvedor.imagem"
	                },
	                {
	                    name: "desenvolvedor-biografia",
	                    bind: "valores.desenvolvedor.biografia",
	                    tts: "$bind"
	                }
	            ]
	        },
	        {
	            name: "content-colaboradores", children:
	            [
	                {
	                    name: "colaboradores",
	                    datasource: "valores.colaboradores",
	                    children: [
	                        {
	                            name: "colaborador",
	                            tts: "sprintf(\"%s - %s \", \"$data.nome\", \"$data.cargo\")",
	                            children: [
	                                { name: "colaborador-image", bind: "$data.img" },
	                                { name: "colaborador-nome", bind: "$data.nome" },
	                                { name: "colaborador-cargo", bind:"$data.cargo" }
	                            ]
	                        }
	                    ]
	                }
	            ]
	        },
	        {
	            name: "content-exemplos", children:
	            [
	                {
	                    name: "container-exemplos", children:
	                    [
	                        {
	                            name: "container-titulo-exemplo", children:
	                            [
	                                { name: "item-title-exemplos" },
	                                { name: "item-subtitle-exemplos" }
	                            ]
	                        },
	                        {
	                            name: "exemplos",
	                            datasource: "valores.exemplos",
	                            children: [
	                                {
	                                    name: "exemplo",
	                                    children: [
	                                        { name: "exemplo-image" },
	                                        { name: "exemplo-link" },
	                                        { name: "exemplo-codigo-fonte" }
	                                    ]
	                                }
	                            ]
	                        }
	                    ]
	                }
	            ]
	        },
	        {
	            name: "content-videos", children:
	            [
	                {
	                    name: "videos",
	                    datasource: "valores.videos",
	                    children: [
	                        {
	                            name: "video",
	                            bind:"$data",
	                            tts: "$data.titulo"
	                        }
	                    ]
	                }
	            ]
	        }
		]
	}
];

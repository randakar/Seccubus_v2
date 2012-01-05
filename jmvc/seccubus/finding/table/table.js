steal(	'jquery/controller',
	'jquery/view/ejs',
	'jquery/controller/view',
	'seccubus/models' )
.then(	'./views/init.ejs',
	'./views/finding.ejs',
	'./views/error.ejs',
function($){

/**
 * @class Seccubus.Finding.Table
 */
$.Controller('Seccubus.Finding.Table',
/** @Static */
{
	defaults : {
		workspace	: -1,
		scans		: null,
		status		: 1,
		host		: "*",
		hostName	: "*",
		port		: "*",
		plugin		: "*",
		orderBy		: "host",
		descending	: false,
		columns		: [ 	"host", "IP", 
					"hostNmae", "HostName", 
					"port", "Port", 
					"plugin", "Plugin", 
					"severity", "Severity", 
					"find", "Finding",
					"remark", "Remark",
					"", "Action"
				  ],
	}
},
/** @Prototype */
{
	init : function(){
		this.updateView();
	},
	updateView : function() {
		if ( this.options.workspace < 0  ) {
			this.element.html(
				this.view('error',{
					columns		: this.options.columns,
					orderBy		: this.options.orderBy,
					descending	: this.options.descending,
					message : "Please select a workspace first"
				})
			);
		} else if ( this.options.scans == null ) {
			this.element.html(
				this.view('error',{
					columns		: this.options.columns,
					orderBy		: this.options.orderBy,
					descending	: this.options.descending,
					message : "Please select one or more scans"
				})
			);
		} else {
			this.element.html(
				this.view(
					'init',
					Seccubus.Models.Finding.findAll({
						workspaceId	: this.options.workspace
					}), 
					{
						columns		: this.options.columns,
						fStatus		: this.options.status,
						fScans		: this.options.scans,
						fHost		: this.options.host,
						fHostName	: this.options.hostName,
						fPort		: this.options.port,
						fPlugin		: this.options.plugin,
						orderBy		: this.options.orderBy,
						descending	: this.options.descending,
						fn		: this.sortFunc(this.options.orderBy,this.options.descending),
					}
				)
			);
		}
	},
	"th click" : function(el,ev) {
		if($(el).attr("sort")) {	// Only sort when sort column
			if(this.options.orderBy == $(el).attr("sort")) {
				if ( this.options.descending ) {
					this.options.descending = false;
				} else {
					this.options.descending = true;
				}
			} else {
				this.options.orderBy = $(el).attr("sort");
				this.options.descending = false;
			}
			this.updateView();
		}
	},
	".editFinding click" : function(el,ev) {
		alert("Editing is not (yet) implemented");
	},
	".changeState click" : function(el,ev) {
		var newState = $(el).attr("value");
		var finding = el.closest('.finding').model();
		finding.attr("status",newState);
		finding.attr("workspaceId",this.options.workspace);
		finding.attr("overwrite",1);
		finding.save();
	},
	"{Seccubus.Models.Finding} created" : function(Finding, ev, finding) {
		alert("table created:" + finding.id);
	},
	"{Seccubus.Models.Finding} updated" : function(Finding, ev, finding) {
		//alert("table updated :" + finding.id);
		if(find.status == this.options.status) {
			finding.elements(this.element).html(
				this.view('finding',finding)
			);
		} else {
			this.updateView();
		}
	},
	"{Seccubus.Models.Finding} destroyed" : function(Finding, ev, finding) {
		alert("table destroyed:" + finding.id);
	},
	sortFunc : function(at, rev) {
		var fn;
		if ( false ) {
			/* Funciton to sort IP's goes here */	
		} else {
			fn = "if (a.attr('" + at + "') < b.attr('" + at + "')) { return -1; } else if ( a.attr('" + at + "') == b.attr('" + at + "')) { return 0; } else { return 1; }";
		}
		if ( rev ) {
			fn = new Function("b","a",fn);
		} else {
			fn = new Function("a","b",fn);
		}
		return fn;
	},
	update : function(options){
		this._super(options);
		this.updateView();
	},
}) // Controller

}); // Steal

function BusinessProcess() {
    var self = this;

    /**
     * Business process name
     * @type {String}
     */
    this.business_process = null;

    /**
     * Array of measures with values
     * @type array of {Measures}
     */
    this.measures = null;

    this.rank = 0;

    this.optional_metrics = [];

    this.story = null;

    this.getJSON = function () {
        var string = "{";

        string += '"name": "' + this.business_process + '"';
        string += ', ';

        string += '"rank": "' + this.rank + '"';
        string += ', ';

        string += '"measures": [ ';
        if (this.measures !== null) {
            for (var i = 0; i < this.measures.length; i++) {
                if (i > 0) string += ', ';
                string += this.measures[i].getJSON();
            }
        }
        string += ' ]';

        string += ', ';

        string += '"optional_metrics": [ ';
        for (var j = 0; j < this.optional_metrics.length; j++) {
            if (j > 0) string += ', ';
            string += this.optional_metrics[j].getJSON();
        }
        string += ' ]';

        if (this.story !== null) {
            string += ', ';
            string += '"story": ' + this.story.getJSON();
        }

        string += '}';
        return string;
    };
}

function OptMetrics() {
    var self = this;

    this.name = '';
    this.before = 0;
    this.after = 0;

    this.getJSON = function () {
        var string = "{";
        string += '"name": "' + this.name + '"';
        string += ', ';
        string += '"before": "' + this.before + '"';
        string += ', ';
        string += '"after": "' + this.after + '"';
        string += "}";
        return string;
    };
}

function Story () {
    var self = this;

    this.name = '';
    this.before = '';
    this.after = '';
    this.impact = '';
    this.contact_name = '';
    this.contact_role = '';
    this.contact_data = '';

    this.salesforce_id = '';

    this.blob = null;
    this.data_type = null;


    this.getJSON = function () {
        var string = "{";
        string += '"name": "' + this.name + '"';
        string += ', ';
        string += '"before": ' + this.before;
        string += ', ';
        string += '"after": ' + this.after;
        string += ', ';
        string += '"impact": ' + this.impact;
        string += ', ';
        string += '"contact_name": ' + this.contact_name;
        string += ', ';
        string += '"contact_role": ' + this.contact_role;
        string += ', ';
        string += '"contact_data": ' + this.contact_data;
        string += ', ';
        string += '"salesforce_id": ' + this.salesforce_id;
        if (this.blob !== null) {
            string += ', ';
            string += '"blob": "' + this.blob + '"';
            string += ', ';
            string += '"data_type": "' + this.data_type + '"';
        }
        string += "}";
        return string;
    };
}


function Measures() {
    var self = this;

    // this.name = '';

    this.value = null;

    this.getJSON = function () {
        var string = "{";
        string += '"value": "' + this.value + '"';

        string += "}";
        return string;
    };
}


function Result() {

    var self = this;

    /**
     * Business function assessed in the process.
     * @type {String}
     */
    this.business_function = null;
    this.company = null;

    /**
     * An array of business processes and their assessment
     * @type array of {BusinessProcess}
     */
    this.business_processes = null;

    this.measures = [];

    this.getJSON = function () {
        var string = '{';
        string += '"business_function": "' + this.business_function + '"';
        string += ', ';

        string += '"company": "' + this.company + '"';
        string += ', ';

        string += '"measures": [ ';
        for (var j = 0; j < this.measures.length; j++) {
            if (j > 0) string += ', ';
            string += '{ "name": "' + this.measures[j].name + '" }';
        }
        string += ' ]';
        string += ', ';

        string += '"business_processes": [ ';
        if (this.business_processes !== null) {
            for (var i = 0; i < this.business_processes.length; i++) {
                if (i > 0) string += ', ';
                string += this.business_processes[i].getJSON();
            }
        }
        string += ' ]';

        string += "}";
        return string;
    };

    this.setBusinessFunction = function (bf) {
        this.business_function = bf.name;
    };

    this.addBusinessProcess = function (i, bp, m, rank) {
        var proc = this.business_processes[i];
       proc.measures = m;
       proc.rank = rank;
    };
}

package org.redhat.bbank.model;

public class Variable {
   private String type;
   private double value; 

   
   public Variable() {
    }

    public Variable(String type, double value) {
		this.type = type;
		this.value = value;
	}
    /**
     * @return String return the type
     */
    public String getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * @return String return the value
     */
    public double getValue() {
        return value;
    }

    /**
     * @param value the value to set
     */
    public void setValue(double value) {
        this.value = value;
    }

	@Override
	public String toString() {
		return "Variable [type=" + type + ", value=" + value + "]";
	}


	

}
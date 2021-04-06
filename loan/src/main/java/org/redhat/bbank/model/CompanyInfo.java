package org.redhat.bbank.model;

public class CompanyInfo {


    private String siren;
    private double ca;
    private double nbEmployees;
    private int age;
    private boolean publicSupport;
    private String typeProjet;
    private double amount;


    public CompanyInfo() {
    }
    
    public CompanyInfo(String siren, double ca, double nbEmployees, int age, boolean publicSupport, String typeProjet,
			double amount) {
		this.siren = siren;
		this.ca = ca;
		this.nbEmployees = nbEmployees;
		this.age = age;
		this.publicSupport = publicSupport;
		this.typeProjet = typeProjet;
		this.amount = amount;
	}

    /**
     * @return String return the siren
     */
    public String getSiren() {
        return siren;
    }

    /**
     * @param siren the siren to set
     */
    public void setSiren(String siren) {
        this.siren = siren;
    }

    /**
     * @return double return the ca
     */
    public double getCa() {
        return ca;
    }

    /**
     * @param ca the ca to set
     */
    public void setCa(double ca) {
        this.ca = ca;
    }

    /**
     * @return double return the nbEmployees
     */
    public double getNbEmployees() {
        return nbEmployees;
    }

    /**
     * @param nbEmployees the nbEmployees to set
     */
    public void setNbEmployees(double nbEmployees) {
        this.nbEmployees = nbEmployees;
    }

    /**
     * @return int return the age
     */
    public int getAge() {
        return age;
    }

    /**
     * @param age the age to set
     */
    public void setAge(int age) {
        this.age = age;
    }

    /**
     * @return boolean return the publicSupport
     */
    public boolean isPublicSupport() {
        return publicSupport;
    }

    /**
     * @param publicSupport the publicSupport to set
     */
    public void setPublicSupport(boolean publicSupport) {
        this.publicSupport = publicSupport;
    }

    /**
     * @return String return the typeProjet
     */
    public String getTypeProjet() {
        return typeProjet;
    }

    /**
     * @param typeProjet the typeProjet to set
     */
    public void setTypeProjet(String typeProjet) {
        this.typeProjet = typeProjet;
    }

    /**
     * @return double return the amount
     */
    public double getAmount() {
        return amount;
    }

    /**
     * @param amount the amount to set
     */
    public void setAmount(double amount) {
        this.amount = amount;
    }

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + age;
		long temp;
		temp = Double.doubleToLongBits(amount);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		temp = Double.doubleToLongBits(ca);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		temp = Double.doubleToLongBits(nbEmployees);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		result = prime * result + (publicSupport ? 1231 : 1237);
		result = prime * result + ((siren == null) ? 0 : siren.hashCode());
		result = prime * result + ((typeProjet == null) ? 0 : typeProjet.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CompanyInfo other = (CompanyInfo) obj;
		if (age != other.age)
			return false;
		if (Double.doubleToLongBits(amount) != Double.doubleToLongBits(other.amount))
			return false;
		if (Double.doubleToLongBits(ca) != Double.doubleToLongBits(other.ca))
			return false;
		if (Double.doubleToLongBits(nbEmployees) != Double.doubleToLongBits(other.nbEmployees))
			return false;
		if (publicSupport != other.publicSupport)
			return false;
		if (siren == null) {
			if (other.siren != null)
				return false;
		} else if (!siren.equals(other.siren))
			return false;
		if (typeProjet == null) {
			if (other.typeProjet != null)
				return false;
		} else if (!typeProjet.equals(other.typeProjet))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "CompanyInfo [age=" + age + ", amount=" + amount + ", ca=" + ca + ", nbEmployees=" + nbEmployees
				+ ", publicSupport=" + publicSupport + ", siren=" + siren + ", typeProjet=" + typeProjet + "]";
	}


	



}
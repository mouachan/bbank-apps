package org.redhat.mongodb;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.quarkus.mongodb.panache.MongoEntity;
import io.quarkus.mongodb.panache.PanacheMongoEntity;
import org.bson.Document;



@MongoEntity(collection = "companyInfo")
public class CompanyInfo extends PanacheMongoEntity {

    private String id;
    private String statusRcs;
    private String denomination;
    private String siret;
    private String siren;
    private String address;
    private String tva;
    private String type;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date immatriculationDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date updateDate;
    private  String capitalSocial;
    private String chiffreAffaire;
    private String trancheEffectif;

    public CompanyInfo(){}
   
    public CompanyInfo(String denomination, String siren) {
        this.denomination = denomination;
        this.siren = siren;
    }

    public CompanyInfo(String id, String statusRcs, String denomination, String siret, String siren, String address,
    String tva, String type, Date immatriculationDate, Date updateDate, String capitalSocial,
    String chiffreAffaire, String trancheEffectif) {
        this.id = id;
        this.statusRcs = statusRcs;
        this.denomination = denomination;
        this.siret = siret;
        this.siren = siren;
        this.address = address;
        this.tva = tva;
        this.type = type;
        this.immatriculationDate = immatriculationDate;
        this.updateDate = updateDate;
        this.capitalSocial = capitalSocial;
        this.chiffreAffaire = chiffreAffaire;
        this.trancheEffectif = trancheEffectif;

        }

   

    public static CompanyInfo findBySiren(String siren){
        Document document = new Document()
        .append("siren", siren); 
       return  (CompanyInfo)find(document).firstResult();
    }

    public static CompanyInfo findFirstBySiren(String siren){
        Document document = new Document()
        .append("siren", siren); 
       return  (CompanyInfo)find(document).firstResult();
    }

    /**
     * @return Date return the statusRcs
     */
    public String getStatusRcs() {
        return statusRcs;
    }

    /**
     * @param statusRcs the statusRcs to set
     */
    public void setStatusRcs(String statusRcs) {
        this.statusRcs = statusRcs;
    }

    /**
     * @return String return the denomination
     */
    public String getDenomination() {
        return denomination;
    }

    /**
     * @param denomination the denomination to set
     */
    public void setDenomination(String denomination) {
        this.denomination = denomination;
    }

    /**
     * @return String return the siret
     */
    public String getSiret() {
        return siret;
    }

    /**
     * @param siret the siret to set
     */
    public void setSiret(String siret) {
        this.siret = siret;
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
     * @return String return the address
     */
    public String getaddress() {
        return address;
    }

    /**
     * @param address the address to set
     */
    public void setaddress(String address) {
        this.address = address;
    }

    /**
     * @return String return the tva
     */
    public String getTva() {
        return tva;
    }

    /**
     * @param tva the tva to set
     */
    public void setTva(String tva) {
        this.tva = tva;
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
     * @return Date return the immatriculationDate
     */
    public Date getImmatriculationDate() {
        return immatriculationDate;
    }

    /**
     * @param immatriculationDate the immatriculationDate to set
     */
    public void setImmatriculationDate(Date immatriculationDate) {
        this.immatriculationDate = immatriculationDate;
    }

    /**
     * @return Date return the updateDate
     */
    public Date getUpdateDate() {
        return updateDate;
    }

    /**
     * @param updateDate the updateDate to set
     */
    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    @Override
	public String toString() {
		return "CompanyInfo [address=" + address + ", capitalSocial=" + capitalSocial + ", chiffreAffaire="
				+ chiffreAffaire + ", denomination=" + denomination + ", id=" + id + ", immatriculationDate="
				+ immatriculationDate + ", siren=" + siren + ", siret=" + siret + ", statusRcs=" + statusRcs
				+ ", trancheEffectif=" + trancheEffectif + ", tva=" + tva + ", type=" + type + ", updateDate="
				+ updateDate + "]";
	}

    @Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((address == null) ? 0 : address.hashCode());
		result = prime * result + ((capitalSocial == null) ? 0 : capitalSocial.hashCode());
		result = prime * result + ((chiffreAffaire == null) ? 0 : chiffreAffaire.hashCode());
		result = prime * result + ((denomination == null) ? 0 : denomination.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((immatriculationDate == null) ? 0 : immatriculationDate.hashCode());
		result = prime * result + ((siren == null) ? 0 : siren.hashCode());
		result = prime * result + ((siret == null) ? 0 : siret.hashCode());
		result = prime * result + ((statusRcs == null) ? 0 : statusRcs.hashCode());
		result = prime * result + ((trancheEffectif == null) ? 0 : trancheEffectif.hashCode());
		result = prime * result + ((tva == null) ? 0 : tva.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
		result = prime * result + ((updateDate == null) ? 0 : updateDate.hashCode());
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
		if (address == null) {
			if (other.address != null)
				return false;
		} else if (!address.equals(other.address))
			return false;
		if (capitalSocial == null) {
			if (other.capitalSocial != null)
				return false;
		} else if (!capitalSocial.equals(other.capitalSocial))
			return false;
		if (chiffreAffaire == null) {
			if (other.chiffreAffaire != null)
				return false;
		} else if (!chiffreAffaire.equals(other.chiffreAffaire))
			return false;
		if (denomination == null) {
			if (other.denomination != null)
				return false;
		} else if (!denomination.equals(other.denomination))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (immatriculationDate == null) {
			if (other.immatriculationDate != null)
				return false;
		} else if (!immatriculationDate.equals(other.immatriculationDate))
			return false;
		if (siren == null) {
			if (other.siren != null)
				return false;
		} else if (!siren.equals(other.siren))
			return false;
		if (siret == null) {
			if (other.siret != null)
				return false;
		} else if (!siret.equals(other.siret))
			return false;
		if (statusRcs == null) {
			if (other.statusRcs != null)
				return false;
		} else if (!statusRcs.equals(other.statusRcs))
			return false;
		if (trancheEffectif == null) {
			if (other.trancheEffectif != null)
				return false;
		} else if (!trancheEffectif.equals(other.trancheEffectif))
			return false;
		if (tva == null) {
			if (other.tva != null)
				return false;
		} else if (!tva.equals(other.tva))
			return false;
		if (type == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		if (updateDate == null) {
			if (other.updateDate != null)
				return false;
		} else if (!updateDate.equals(other.updateDate))
			return false;
		return true;
	}


    /**
     * @return String return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
    }


    /**
     * @return String return the address
     */
    public String getAddress() {
        return address;
    }

    /**
     * @param address the address to set
     */
    public void setAddress(String address) {
        this.address = address;
    }

    // /**
    //  * @return Notation return the note
    //  */
    // public Notation getNote() {
    //     return note;
    // }

    // /**
    //  * @param note the note to set
    //  */
    // public void setNote(Notation note) {
    //     this.note = note;
    // }


    /**
     * @return String return the capitalSocial
     */
    public String getCapitalSocial() {
        return capitalSocial;
    }

    /**
     * @param capitalSocial the capitalSocial to set
     */
    public void setCapitalSocial(String capitalSocial) {
        this.capitalSocial = capitalSocial;
    }

    /**
     * @return String return the chiffreAffaire
     */
    public String getChiffreAffaire() {
        return chiffreAffaire;
    }

    /**
     * @param chiffreAffaire the chiffreAffaire to set
     */
    public void setChiffreAffaire(String chiffreAffaire) {
        this.chiffreAffaire = chiffreAffaire;
    }

    /**
     * @return String return the trancheEffectif
     */
    public String getTrancheEffectif() {
        return trancheEffectif;
    }

    /**
     * @param trancheEffectif the trancheEffectif to set
     */
    public void setTrancheEffectif(String trancheEffectif) {
        this.trancheEffectif = trancheEffectif;
    }
	


}